import Head from "next/head";
import Link from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";
import { getCanonicalUrl } from "lib/url-utils";

const appName = "van Gogh ai";
const appMetaDescription = "Transform your ideas into stunning visuals with AI-powered Paint by Text technology. Upload images and edit them using simple text descriptions.";

export default function About() {
  // 动态生成canonical URL
  const canonicalUrl = getCanonicalUrl('about');
  
  return (
    <div lang="en">
      <Head>
        <title>About van Gogh AI - Paint by Text: Ideas to Stunning Visuals</title>
        <meta name="description" content="Learn about van Gogh AI Paint by Text technology. Transform your written ideas into stunning visuals with no art skills needed!" />
        <meta name="keywords" content="van Gogh ai,Paint by Text,InstructPix2Pix,AI image editing Online,image generation,artistic style transformation,about" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="en-US" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      </Head>

      <main className="container max-w-[800px] mx-auto p-6">
        <div className="apple-card">
          <h1 className="text-center text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About {appName}
          </h1>

          <div className="prose max-w-none">
            <p className="text-xl leading-relaxed mb-6">
              This is an innovative AI image editing tool that allows you to modify images through simple text descriptions. No complex operations needed - just describe your vision in natural language, and AI will make it happen.
            </p>

            <h2 className="text-2xl font-bold mb-4">Core Features</h2>
            <ul className="space-y-2 mb-6">
              <li>🎨 <b>Smart Recognition</b> - AI understands your text descriptions and precisely identifies modification requirements</li>
              <li>🖼️ <b>Precise Editing</b> - Maintains original image quality while modifying only the parts you specify</li>
              <li>⚡ <b>Fast Generation</b> - Complete image processing in seconds with instant results</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">How to Use?</h2>
            <ol className="space-y-3 mb-8">
              <li><b>1. Upload Image</b> - Select the image you want to edit, supports common image formats</li>
              <li><b>2. Describe Changes</b> - Use simple English to describe the modifications you want, like "make the sky purple"</li>
              <li><b>3. Get Results</b> - AI will automatically process and generate the modified image, you can continue editing or download</li>
            </ol>

            <p className="text-lg leading-relaxed">
              This tool is built on advanced AI technology using the clean Next.js framework, providing users with a smooth experience.
              We are committed to making AI technology more accessible to ordinary users, allowing everyone to easily edit ideal images.
            </p>
          </div>

        <div className="text-center mt-10">
          <Link
            href="/"
              className="modern-button primary text-lg px-8 py-4">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />Start Editing Images
          </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
