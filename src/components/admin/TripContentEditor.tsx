import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Trip, ItineraryDay, FAQ } from "@/lib/supabaseService";

interface TripContentEditorProps {
  trip: Trip;
  onSave: (updates: Partial<Trip>) => void;
  onCancel: () => void;
}

const TripContentEditor = ({ trip, onSave, onCancel }: TripContentEditorProps) => {
  const [editData, setEditData] = useState<Partial<Trip>>({
    overview_content: trip.overview_content || trip.short_desc || '',
    itinerary: trip.itinerary || [],
    inclusions: trip.inclusions || [],
    exclusions: trip.exclusions || [],
    things_to_carry: trip.things_to_carry || [],
    cancellation_policy: trip.cancellation_policy || '',
    faqs: trip.faqs || []
  });

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: (editData.itinerary?.length || 0) + 1,
      title: '',
      description: '',
      activities: [],
      meals: [],
      accommodation: ''
    };
    setEditData({
      ...editData,
      itinerary: [...(editData.itinerary || []), newDay]
    });
  };

  const updateItineraryDay = (index: number, updates: Partial<ItineraryDay>) => {
    const updatedItinerary = [...(editData.itinerary || [])];
    updatedItinerary[index] = { ...updatedItinerary[index], ...updates };
    setEditData({ ...editData, itinerary: updatedItinerary });
  };

  const removeItineraryDay = (index: number) => {
    const updatedItinerary = editData.itinerary?.filter((_, i) => i !== index) || [];
    setEditData({ ...editData, itinerary: updatedItinerary });
  };

  const addListItem = (field: 'inclusions' | 'exclusions' | 'things_to_carry', item: string) => {
    if (!item.trim()) return;
    const currentList = editData[field] || [];
    setEditData({
      ...editData,
      [field]: [...currentList, item.trim()]
    });
  };

  const removeListItem = (field: 'inclusions' | 'exclusions' | 'things_to_carry', index: number) => {
    const currentList = editData[field] || [];
    setEditData({
      ...editData,
      [field]: currentList.filter((_, i) => i !== index)
    });
  };

  const addFAQ = () => {
    const newFAQ: FAQ = { question: '', answer: '' };
    setEditData({
      ...editData,
      faqs: [...(editData.faqs || []), newFAQ]
    });
  };

  const updateFAQ = (index: number, updates: Partial<FAQ>) => {
    const updatedFAQs = [...(editData.faqs || [])];
    updatedFAQs[index] = { ...updatedFAQs[index], ...updates };
    setEditData({ ...editData, faqs: updatedFAQs });
  };

  const removeFAQ = (index: number) => {
    const updatedFAQs = editData.faqs?.filter((_, i) => i !== index) || [];
    setEditData({ ...editData, faqs: updatedFAQs });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Trip Content</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => onSave(editData)} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={onCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Overview Content */}
          <div>
            <Label htmlFor="overview">Overview Content</Label>
            <Textarea
              id="overview"
              value={editData.overview_content || ''}
              onChange={(e) => setEditData({...editData, overview_content: e.target.value})}
              rows={4}
              className="mt-2"
            />
          </div>

          {/* Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Itinerary</Label>
              <Button onClick={addItineraryDay} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Day
              </Button>
            </div>
            <div className="space-y-4">
              {editData.itinerary?.map((day, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Day {day.day}</h4>
                      <Button onClick={() => removeItineraryDay(index)} size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Day title"
                        value={day.title}
                        onChange={(e) => updateItineraryDay(index, { title: e.target.value })}
                      />
                      <Input
                        placeholder="Accommodation"
                        value={day.accommodation || ''}
                        onChange={(e) => updateItineraryDay(index, { accommodation: e.target.value })}
                      />
                    </div>
                    <Textarea
                      placeholder="Day description"
                      value={day.description}
                      onChange={(e) => updateItineraryDay(index, { description: e.target.value })}
                      rows={2}
                      className="mt-3"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <Label>Inclusions</Label>
            <div className="mt-2 space-y-2">
              {editData.inclusions?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={item} readOnly className="flex-1" />
                  <Button onClick={() => removeListItem('inclusions', index)} size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add inclusion..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addListItem('inclusions', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addListItem('inclusions', input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Exclusions */}
          <div>
            <Label>Exclusions</Label>
            <div className="mt-2 space-y-2">
              {editData.exclusions?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={item} readOnly className="flex-1" />
                  <Button onClick={() => removeListItem('exclusions', index)} size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add exclusion..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addListItem('exclusions', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addListItem('exclusions', input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Things to Carry */}
          <div>
            <Label>Things to Carry</Label>
            <div className="mt-2 space-y-2">
              {editData.things_to_carry?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={item} readOnly className="flex-1" />
                  <Button onClick={() => removeListItem('things_to_carry', index)} size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add item to carry..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addListItem('things_to_carry', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addListItem('things_to_carry', input.value);
                    input.value = '';
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <Label htmlFor="policy">Cancellation Policy</Label>
            <Textarea
              id="policy"
              value={editData.cancellation_policy || ''}
              onChange={(e) => setEditData({...editData, cancellation_policy: e.target.value})}
              rows={4}
              className="mt-2"
            />
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>FAQs</Label>
              <Button onClick={addFAQ} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
            <div className="space-y-4">
              {editData.faqs?.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">FAQ {index + 1}</h4>
                      <Button onClick={() => removeFAQ(index)} size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, { question: e.target.value })}
                      className="mb-3"
                    />
                    <Textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, { answer: e.target.value })}
                      rows={2}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default TripContentEditor;
