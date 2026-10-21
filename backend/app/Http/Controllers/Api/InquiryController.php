<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\InquiryNote;
use App\Models\InquiryStatusHistory;
use App\Models\SiteSetting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    // Public: Submit inquiry from website
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'product_name' => 'nullable|string|max:255',
            'quantity' => 'nullable|integer|min:1',
            'required_date' => 'nullable|date',
            'customization' => 'nullable|string',
            'material_preference' => 'nullable|string|max:255',
            'color_preference' => 'nullable|string|max:255',
            'size_preference' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'logo_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,ai,svg|max:10240',
        ]);

        // Generate unique Inquiry ID
        $year = date('Y');
        $count = Inquiry::whereYear('created_at', $year)->count() + 1;
        $inquiryId = 'ASK-' . $year . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);

        // Get current WhatsApp number from settings
        $waNumber = SiteSetting::where('key', 'whatsapp_number')->value('value') ?? '919004408854';

        $data = $request->only([
            'name', 'company', 'phone', 'email',
            'product_name', 'quantity', 'required_date',
            'customization', 'material_preference', 'color_preference',
            'size_preference', 'message'
        ]);
        $data['inquiry_id'] = $inquiryId;
        $data['status'] = 'new';
        $data['whatsapp_number'] = $waNumber;

        // Handle logo upload
        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('inquiry-attachments', 'public');
            $data['logo_file'] = '/storage/' . $path;
        }

        $inquiry = Inquiry::create($data);

        // Generate WhatsApp message
        $whatsappMessage = $this->generateWhatsAppMessage($inquiry);
        $cleanNumber = preg_replace('/[^0-9]/', '', $waNumber);
        $whatsappUrl = 'https://wa.me/' . $cleanNumber . '?text=' . urlencode($whatsappMessage);

        return response()->json([
            'inquiry_id' => $inquiryId,
            'whatsapp_url' => $whatsappUrl,
            'message' => 'Your inquiry has been received successfully!',
        ], 201);
    }

    private function generateWhatsAppMessage(Inquiry $inquiry): string
    {
        $lines = [
            "Hello ASKMEBAG,",
            "I would like to enquire about a bulk customized bag order.",
            "",
            "━━━━━━━━━━━━━━━━",
            "INQUIRY DETAILS",
            "━━━━━━━━━━━━━━━━",
            "Inquiry ID: #{$inquiry->inquiry_id}",
            "",
            "Customer Name: {$inquiry->name}",
        ];

        if ($inquiry->company) $lines[] = "Company: {$inquiry->company}";
        $lines[] = "Mobile: {$inquiry->phone}";
        if ($inquiry->email) $lines[] = "Email: {$inquiry->email}";

        $lines[] = "";
        if ($inquiry->product_name) $lines[] = "Product: {$inquiry->product_name}";
        if ($inquiry->quantity) $lines[] = "Quantity: {$inquiry->quantity} Units";
        if ($inquiry->required_date) $lines[] = "Required Date: " . date('d M Y', strtotime($inquiry->required_date));
        if ($inquiry->customization) $lines[] = "Customization: {$inquiry->customization}";
        if ($inquiry->material_preference) $lines[] = "Material: {$inquiry->material_preference}";
        if ($inquiry->color_preference) $lines[] = "Color: {$inquiry->color_preference}";
        if ($inquiry->size_preference) $lines[] = "Size: {$inquiry->size_preference}";
        if ($inquiry->message) $lines[] = "Additional Notes: {$inquiry->message}";

        $lines[] = "";
        $lines[] = "━━━━━━━━━━━━━━━━";
        $lines[] = "Thank you.";

        return implode("\n", $lines);
    }

    // Admin: List all inquiries
    public function index(Request $request)
    {
        $query = Inquiry::with(['notes', 'statusHistory']);

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('company', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('inquiry_id', 'like', "%{$request->search}%")
                  ->orWhere('product_name', 'like', "%{$request->search}%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $perPage = $request->per_page ?? 20;
        return response()->json($query->orderByDesc('created_at')->paginate($perPage));
    }

    public function show($id)
    {
        $inquiry = Inquiry::with(['notes', 'statusHistory'])->findOrFail($id);
        return response()->json($inquiry);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $inquiry = Inquiry::findOrFail($id);
        $oldStatus = $inquiry->status;

        $inquiry->update(array_filter([
            'status' => $request->status,
            'assigned_to' => $request->assigned_to,
            'follow_up_date' => $request->follow_up_date,
            'quotation_amount' => $request->quotation_amount,
        ], fn($v) => !is_null($v)));

        InquiryStatusHistory::create([
            'inquiry_id' => $inquiry->id,
            'user_id' => $request->user()->id,
            'from_status' => $oldStatus,
            'to_status' => $request->status,
            'note' => $request->note,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'update',
            'entity_type' => 'inquiry',
            'entity_id' => $inquiry->id,
            'description' => "Inquiry #{$inquiry->inquiry_id} status changed: {$oldStatus} → {$request->status}",
        ]);

        return response()->json(['message' => 'Status updated', 'inquiry' => $inquiry->fresh(['notes', 'statusHistory'])]);
    }

    public function addNote(Request $request, $id)
    {
        $request->validate(['note' => 'required|string']);
        $inquiry = Inquiry::findOrFail($id);

        $note = InquiryNote::create([
            'inquiry_id' => $inquiry->id,
            'user_id' => $request->user()->id,
            'note' => $request->note,
            'type' => $request->type ?? 'note',
        ]);

        return response()->json(['message' => 'Note added', 'note' => $note], 201);
    }

    public function getWhatsAppUrl($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $message = $this->generateWhatsAppMessage($inquiry);
        $cleanNumber = preg_replace('/[^0-9]/', '', $inquiry->whatsapp_number ?? '919004408854');
        $url = 'https://wa.me/' . $cleanNumber . '?text=' . urlencode($message);
        return response()->json(['url' => $url]);
    }

    public function destroy(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiryId = $inquiry->inquiry_id;
        $inquiry->notes()->delete();
        $inquiry->statusHistory()->delete();
        $inquiry->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'action' => 'delete',
            'entity_type' => 'inquiry',
            'entity_id' => $id,
            'description' => "Deleted inquiry #{$inquiryId}",
        ]);

        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
}
