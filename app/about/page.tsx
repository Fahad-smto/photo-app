import { Camera, Shield, Users, Zap } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Camera,
      title: "Easy Upload",
      description: "Upload your photos with drag & drop support",
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your photos are safely stored and protected",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Share and discover photos from users worldwide",
    },
    {
      icon: Zap,
      title: "Fast Performance",
      description: "Optimized for quick loading and smooth experience",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About PhotoUpload</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're on a mission to make photo sharing simple, beautiful, and accessible
          for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2024, PhotoUpload was born from a simple idea: creating a
            platform where people can easily share their precious moments without
            complicated processes or hidden fees.
          </p>
          <p className="text-gray-600 mb-4">
            What started as a small project has grown into a thriving community of
            photography enthusiasts, professional photographers, and everyday users
            who want to share their memories with loved ones.
          </p>
          <p className="text-gray-600">
            Today, we're proud to host thousands of photos and facilitate millions of
            views, all while maintaining our commitment to simplicity, security, and
            user experience.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-lg mb-6">
            To empower people to share their visual stories with the world, making
            photo sharing effortless and enjoyable for everyone.
          </p>
          <div className="space-y-2">
            <p className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span>1M+ Photos uploaded by 2025</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span>Available worldwide</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="text-2xl">💡</span>
              <span>100% free to use</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Why Choose PhotoUpload?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Share Your Photos?
        </h2>
        <p className="text-gray-600 mb-6">
          Join our community of photographers and start sharing your moments today.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started Now
        </button>
      </div>
    </div>
  );
}