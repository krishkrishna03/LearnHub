import { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Youtube, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ExternalLink,
  Play,
  Clock,
  Tag
} from 'lucide-react';
import { getConfig, saveConfig, AppConfig, YoutubeResource } from '../config/config';

const ConfigManager = () => {
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [activeTab, setActiveTab] = useState('urls');
  const [showAddResource, setShowAddResource] = useState(false);
  const [editingResource, setEditingResource] = useState<YoutubeResource | null>(null);
  const [newResource, setNewResource] = useState<Partial<YoutubeResource>>({
    title: '',
    description: '',
    url: '',
    category: '',
    thumbnail: '',
    duration: '',
    isActive: true
  });

  const handleSaveConfig = () => {
    saveConfig(config);
    alert('Configuration saved successfully!');
  };

  const handleAddResource = () => {
    if (!newResource.title || !newResource.url) {
      alert('Please fill in required fields');
      return;
    }

    const resource: YoutubeResource = {
      id: Date.now().toString(),
      title: newResource.title!,
      description: newResource.description || '',
      url: newResource.url!,
      category: newResource.category || 'General',
      thumbnail: newResource.thumbnail || '',
      duration: newResource.duration || '',
      isActive: newResource.isActive ?? true,
      createdAt: new Date().toISOString()
    };

    const updatedConfig = {
      ...config,
      youtubeResources: [...config.youtubeResources, resource]
    };

    setConfig(updatedConfig);
    setNewResource({
      title: '',
      description: '',
      url: '',
      category: '',
      thumbnail: '',
      duration: '',
      isActive: true
    });
    setShowAddResource(false);
  };

  const handleEditResource = (resource: YoutubeResource) => {
    setEditingResource(resource);
    setNewResource(resource);
    setShowAddResource(true);
  };

  const handleUpdateResource = () => {
    if (!editingResource || !newResource.title || !newResource.url) {
      alert('Please fill in required fields');
      return;
    }

    const updatedResource: YoutubeResource = {
      ...editingResource,
      title: newResource.title!,
      description: newResource.description || '',
      url: newResource.url!,
      category: newResource.category || 'General',
      thumbnail: newResource.thumbnail || '',
      duration: newResource.duration || '',
      isActive: newResource.isActive ?? true
    };

    const updatedConfig = {
      ...config,
      youtubeResources: config.youtubeResources.map(r => 
        r.id === editingResource.id ? updatedResource : r
      )
    };

    setConfig(updatedConfig);
    setEditingResource(null);
    setNewResource({
      title: '',
      description: '',
      url: '',
      category: '',
      thumbnail: '',
      duration: '',
      isActive: true
    });
    setShowAddResource(false);
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      const updatedConfig = {
        ...config,
        youtubeResources: config.youtubeResources.filter(r => r.id !== id)
      };
      setConfig(updatedConfig);
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <span>Configuration Manager</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Manage application URLs and YouTube resources
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('urls')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'urls'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Globe className="w-5 h-5 inline mr-2" />
                URL Configuration
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'youtube'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Youtube className="w-5 h-5 inline mr-2" />
                YouTube Resources
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'urls' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">URL Configuration</h2>
                <p className="text-gray-600">
                  Configure the API and frontend URLs for your deployment
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API URL (Backend)
                    </label>
                    <input
                      type="url"
                      value={config.apiUrl}
                      onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://learnhub-869c.onrender.com/api"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your backend API URL (e.g., deployed on Render)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frontend URL
                    </label>
                    <input
                      type="url"
                      value={config.frontendUrl}
                      onChange={(e) => setConfig({ ...config, frontendUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://learnhubk.netlify.app"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your frontend URL (for CORS and redirects)
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Deployment Instructions:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. Deploy your backend to Render and get the URL</li>
                    <li>2. Update the API URL above with your Render backend URL</li>
                    <li>3. Deploy your frontend and update the Frontend URL</li>
                    <li>4. Click "Save Configuration" to apply changes</li>
                    <li>5. The app will automatically use these URLs for API calls</li>
                  </ul>
                </div>

                <button
                  onClick={handleSaveConfig}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            )}

            {activeTab === 'youtube' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">YouTube Resources</h2>
                    <p className="text-gray-600">
                      Manage additional YouTube learning resources for students
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddResource(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Resource</span>
                  </button>
                </div>

                {/* YouTube Resources List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {config.youtubeResources.map((resource) => (
                    <div key={resource.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="relative mb-3">
                        <img
                          src={resource.thumbnail || getYouTubeThumbnail(resource.url)}
                          alt={resource.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180?text=YouTube+Video';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        {!resource.isActive && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            Inactive
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-3 h-3" />
                          <span>{resource.category}</span>
                        </div>
                        {resource.duration && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{resource.duration}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Watch</span>
                        </a>
                        <button
                          onClick={() => handleEditResource(resource)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {config.youtubeResources.length === 0 && (
                  <div className="text-center py-12">
                    <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No YouTube resources yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add YouTube videos and playlists to provide additional learning resources for your students.
                    </p>
                    <button
                      onClick={() => setShowAddResource(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Add Your First Resource
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Resource Modal */}
        {showAddResource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingResource ? 'Edit YouTube Resource' : 'Add YouTube Resource'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newResource.title || ''}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    value={newResource.url || ''}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newResource.description || ''}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the video content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newResource.category || ''}
                      onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="DevOps">DevOps</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newResource.duration || ''}
                      onChange={(e) => setNewResource({ ...newResource, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 15:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Thumbnail URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newResource.thumbnail || ''}
                    onChange={(e) => setNewResource({ ...newResource, thumbnail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty to auto-generate from YouTube"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newResource.isActive ?? true}
                    onChange={(e) => setNewResource({ ...newResource, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (visible to students)
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowAddResource(false);
                    setEditingResource(null);
                    setNewResource({
                      title: '',
                      description: '',
                      url: '',
                      category: '',
                      thumbnail: '',
                      duration: '',
                      isActive: true
                    });
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingResource ? handleUpdateResource : handleAddResource}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  {editingResource ? 'Update Resource' : 'Add Resource'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigManager;
