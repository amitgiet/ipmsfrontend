import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

const ChangeRequest = () => {
  const params = useParams();
  const projectId = params?.projectId;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    changeType: '',
    otherChange: '',
    description: '',
    reason: '',
    priority: '',
    benefits: '',
    risks: '',
    timeline: '',
    attachments: []
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.changeType || !formData.description || !formData.reason || !formData.priority || !formData.benefits || !formData.timeline) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      // Create FormData object
      const bodyData = new FormData();
      bodyData.append('project_id', projectId || '');
      bodyData.append('type_of_change', formData.changeType);
      bodyData.append('description', formData.description);
      bodyData.append('reason_for_change', formData.reason);
      bodyData.append('priority', formData.priority);
      bodyData.append('expected_benefits', formData.benefits);
      bodyData.append('potential_risks', formData.risks || '');
      bodyData.append('preferred_timeline', formData.timeline);

      // Handle file attachments
      if (formData.attachments && formData.attachments.length > 0) {
        formData.attachments.forEach((file, index) => {
          bodyData.append('file', file);
        });
      }

      const { data, error } = await apiCall(allRoutes.clients.changeRequests, 'post', bodyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (error) {
        return;
      }
      toast.success('Change request submitted successfully!');
      setIsSubmitted(true);
      setFormData({
        changeType: '',
        otherChange: '',
        description: '',
        reason: '',
        priority: '',
        benefits: '',
        risks: '',
        timeline: '',
        attachments: [],
        clientEmail: '',
        clientName: '',
        clientPhone: '',
        clientId: '',
        clientAddress: '',
        clientCity: '',
        clientState: '',
        clientZip: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtherChange = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormData(prev => ({ ...prev, otherChange: '' }));
    }
  };

  const handleBack = () => {
    navigate(`/client-project/${projectId}?tab=backlog`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 py-6">
          <button className="inline-flex items-center text-blue-600 hover:text-blue-800 text-base mb-4 transition-colors" onClick={handleBack}>
            <span className="mr-2 text-lg" >←</span>
            Back
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">Change Request Form (CRF)</h1>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Change Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b-2 border-blue-600">
                1. Change Details
              </h2>

              <div className="space-y-4">
                <label className="block font-semibold text-gray-900 text-base mb-3">
                  Type of Change (select one):
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'scope-change', value: '1', label: 'Scope change (new feature / modification)' },
                    { id: 'requirement-change', value: '2', label: 'Requirement clarification / correction' },
                    { id: 'timeline-change', value: '3', label: 'Timeline adjustment' },
                    { id: 'resource-change', value: '4', label: 'Resource adjustment' },
                    { id: 'budget-change', value: '5', label: 'Budget / Cost change' },
                    { id: 'other-change', value: '6', label: 'Other:' }
                  ].map(({ id, value, label }) => (
                    <div key={id} className="flex items-center gap-3">
                      <input
                        type="radio"
                        id={id}
                        name="changeType"
                        value={value}
                        checked={formData.changeType === value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 accent-blue-600"
                      />
                      <label htmlFor={id} className="text-gray-700 cursor-pointer">
                        {label}
                      </label>
                      {value === 'other' && formData.changeType === 'other' && (
                        <input
                          type="text"
                          name="otherChange"
                          value={formData.otherChange}
                          onChange={handleInputChange}
                          placeholder="Please specify"
                          className="ml-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="description" className="block font-semibold text-gray-900 text-base">
                  Detailed Description of Change:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                  placeholder="Please explain clearly what needs to change, why, and any supporting examples or attachments"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="reason" className="block font-semibold text-gray-900 text-base">
                  Reason for Change:
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                  placeholder="Why is this change needed? Business impact, compliance, user demand, error correction, etc."
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block font-semibold text-gray-900 text-base">
                  Priority Level (as per your view):
                </label>
                <div className="flex gap-5 flex-wrap">
                  {[
                    { id: 'high-priority', value: 'high', label: 'High (critical business impact / blocker)' },
                    { id: 'medium-priority', value: 'medium', label: 'Medium (important but not urgent)' },
                    { id: 'low-priority', value: 'low', label: 'Low (nice to have / no immediate impact)' }
                  ].map(({ id, value, label }) => (
                    <div key={id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={id}
                        name="priority"
                        value={value}
                        checked={formData.priority === value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 accent-blue-600"
                        required
                      />
                      <label htmlFor={id} className="text-gray-700 cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Impact Assessment */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b-2 border-blue-600">
                4. Impact Assessment (Client's View)
              </h2>

              <div className="space-y-3">
                <label htmlFor="benefits" className="block font-semibold text-gray-900 text-base">
                  Expected Benefits:
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                  placeholder="What value or improvement will this bring if approved?"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="risks" className="block font-semibold text-gray-900 text-base">
                  Potential Risks if Not Implemented:
                </label>
                <textarea
                  id="risks"
                  name="risks"
                  value={formData.risks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                  placeholder="Describe potential risks or consequences"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="timeline" className="block font-semibold text-gray-900 text-base">
                  Preferred Timeline for Change:
                </label>
                <input
                  type="text"
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Within 2 weeks, By end of month, ASAP"
                  required
                />
              </div>
            </div>

            {/* Section 5: Attachments */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b-2 border-blue-600">
                5. Attachments (if any)
              </h2>

              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-blue-600 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    id="attachments"
                    name="attachments"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <label htmlFor="attachments" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer font-medium hover:bg-blue-700 transition-colors">
                    Choose Files
                  </label>
                  <div className="mt-3 text-gray-600 text-sm">
                    {formData.attachments.length > 0 ? (
                      <span>Selected files: <strong>{formData.attachments.map(f => f.name).join(', ')}</strong></span>
                    ) : (
                      'Upload screenshots, documents, mockups, or reference material to clarify the request.'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-6 border-t border-gray-200 text-center">
              <button
                type="submit"
                className={`px-10 py-4 text-base font-semibold rounded-lg cursor-pointer transition-all ${isSubmitted
                    ? 'bg-green-600 text-white'
                    : isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:translate-y-px'
                  }`}
                disabled={isSubmitted || isSubmitting}
              >
                {isSubmitted
                  ? 'Request Submitted Successfully'
                  : isSubmitting
                    ? 'Submitting...'
                    : 'Submit Change Request'
                }
              </button>
            </div>
          </form>

          {/* Next Steps Section */}
          {isSubmitted && (
            <div className="bg-blue-50 border border-blue-600 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Next Steps</h3>
              <div className="text-gray-700">
                <p className="mb-4"><strong>Thank you for submitting your Change Request. What happens now:</strong></p>
                <ol className="list-decimal list-inside space-y-2 mb-4">
                  <li>Our Project Management team will review your request within 2 business days.</li>
                  <li>We will conduct an impact analysis covering effort, cost, timeline, and risks.</li>
                  <li>The CR will be shared with you for review and approval of revised scope/cost/timeline (if applicable).</li>
                  <li>Once agreed, the change will be scheduled, tracked, and delivered as part of the project.</li>
                </ol>
                <p className="italic text-gray-600">
                  You will receive an email confirmation with your request details and tracking number shortly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeRequest;