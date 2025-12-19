import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // تقليل أحجام الصور لتوفير الذاكرة أثناء البناء
    deviceSizes: [640, 828, 1200], // تقليل من 6 إلى 3 أحجام
    imageSizes: [16, 32, 48, 64, 96, 128], // تقليل من 8 إلى 6 أحجام
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify: true, // غير معروف في Next.js 15 - تم إزالته
  // تعطيل output standalone لتوفير الذاكرة
  // output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // إعدادات webpack لتقليل استخدام الذاكرة والCPU
  webpack: (config, { isServer, dev }) => {
    // تقليل استخدام الذاكرة في webpack
    config.optimization = {
      ...config.optimization,
      // تقليل عدد الـ chunks لتوفير الذاكرة
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // تجميع أصغر للـ vendor chunks
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
            maxSize: 200000, // 200KB max per chunk
          },
        },
      },
    };

    // تقليل استخدام الذاكرة في التطوير
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.git', '**/.next', '**/loza-server-master/**'],
      };
    }

    // استبعاد loza-server-master من البناء
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
      },
    };
    
    // تجاهل ملفات loza-server-master
    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /loza-server-master/,
        use: 'ignore-loader',
      });
    }

    // Ignore fs module in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      };
    }

    // تقليل استخدام الذاكرة في البناء
    config.performance = {
      ...config.performance,
      hints: false, // تعطيل تحذيرات الأداء لتوفير الموارد
    };

    return config;
  },
  // إعدادات تجريبية لتقليل استخدام الموارد
  experimental: {
    // تعطيل الميزات التي تستهلك ذاكرة كبيرة
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
};

export default nextConfig;
