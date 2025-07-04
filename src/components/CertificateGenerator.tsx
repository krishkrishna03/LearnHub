import { useState } from 'react';
import { Award, Download } from 'lucide-react';
import axios from 'axios';

interface CertificateGeneratorProps {
  courseName: string;
  courseId: string;
  studentName: string;
  completionDate: string;
  onDownload: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  courseName,
  courseId,
  studentName,
  completionDate,
  onDownload
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadRequest = () => {
    setShowConfirmation(true);
  };

  const generateCertificate = async () => {
    try {
      setIsGenerating(true);
      
      // Issue certificate and get unique ID
      const response = await axios.post('/certificates', { courseId });
      const certificate = response.data.certificate;

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Set canvas size
      canvas.width = 1200;
      canvas.height = 800;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // White background with border
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Border
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Inner border
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);

      // Title
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', canvas.width / 2, 180);

      // Subtitle
      ctx.font = '24px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('This is to certify that', canvas.width / 2, 240);

      // Student name
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#3B82F6';
      ctx.fillText(studentName, canvas.width / 2, 310);

      // Course completion text
      ctx.font = '24px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('has successfully completed the course', canvas.width / 2, 370);

      // Course name
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#1F2937';
      ctx.fillText(courseName, canvas.width / 2, 430);

      // Date
      ctx.font = '20px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText(`Completed on ${completionDate}`, canvas.width / 2, 500);

      // Certificate ID
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#8B5CF6';
      ctx.fillText(`Certificate ID: ${certificate.certificateId}`, canvas.width / 2, 540);

      // LearnHub branding
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#3B82F6';
      ctx.fillText('LearnHub', canvas.width / 2, 620);

      // Verification URL
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('Verify at: learnhub.com/verify', canvas.width / 2, 650);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${courseName.replace(/\s+/g, '_')}_Certificate_${certificate.certificateId}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });

      setShowConfirmation(false);
      onDownload();
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Download Your Certificate?</h3>
          <p className="text-gray-600 mb-6">
            You're about to download your completion certificate for <strong>{courseName}</strong>. 
            This certificate will include a unique verification ID.
          </p>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Certificate Features:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Unique certificate ID for verification</li>
              <li>• Professional design suitable for portfolios</li>
              <li>• Downloadable as high-quality PNG</li>
              <li>• Verifiable on our platform</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={generateCertificate}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Generate & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h3>
        <p className="text-gray-600 mb-6">
          You have successfully completed <strong>{courseName}</strong>
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Certificate Details</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Student:</strong> {studentName}</p>
            <p><strong>Course:</strong> {courseName}</p>
            <p><strong>Completion Date:</strong> {completionDate}</p>
          </div>
        </div>

        <button
          onClick={handleDownloadRequest}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
        >
          <Download className="w-5 h-5" />
          <span>Download Certificate</span>
        </button>
      </div>
    </div>
  );
};

export default CertificateGenerator;