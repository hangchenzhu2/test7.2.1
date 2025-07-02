import Messages from "components/messages";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Footer from "components/footer";

import prepareImageFileForUpload from "lib/prepare-image-file-for-upload";
import { getRandomSeed } from "lib/seeds";
import { getTranslation, languages } from "lib/i18n";
import { getBaseUrl, getLocalizedUrl, getCanonicalUrl } from "lib/url-utils";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const router = useRouter();
  const { lang } = router.query;
  const currentLanguage = lang || 'en';
  
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seed] = useState(getRandomSeed());
  const [initialPrompt, setInitialPrompt] = useState(seed.prompt);

  // Helper function to get translation
  const t = (key) => getTranslation(key, currentLanguage);

  // Language change handler - navigate to new language route
  const handleLanguageChange = (newLanguage) => {
    router.push(`/${newLanguage}`);
  };

  // Validate language on mount
  useEffect(() => {
    if (lang && !languages[lang]) {
      router.replace('/en');
    }
  }, [lang, router]);

  // set the initial image from a random seed
  useEffect(() => {
    setEvents([{ image: seed.image }]);
  }, [seed.image]);

  // Function to set prompt from buttons - scroll input field to lower center position
  const setPromptFromButton = (promptText) => {
    setInitialPrompt(promptText);
    
    // Auto scroll to position the input field in the lower center of the screen
    setTimeout(() => {
      const inputField = document.getElementById('prompt-input');
      if (inputField) {
        const windowHeight = window.innerHeight;
        const fieldRect = inputField.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;
        
        // Calculate target position: input field at 70% down from top of viewport
        const targetViewportPosition = windowHeight * 0.7;
        const targetScrollPosition = currentScrollY + fieldRect.top - targetViewportPosition;
        
        window.scrollTo({ 
          top: Math.max(0, targetScrollPosition), 
          behavior: 'smooth' 
        });
        
        // Focus on input field after scrolling
        setTimeout(() => {
          inputField.focus();
        }, 800);
      }
    }, 100);
  };

  const handleImageDropped = async (image) => {
    try {
      image = await prepareImageFileForUpload(image);
    } catch (error) {
      setError(error.message);
      return;
    }
    setEvents(events.concat([{ image }]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = e.target.prompt.value;
    const lastImage = events.findLast((ev) => ev.image)?.image;

    setError(null);
    setIsProcessing(true);
    setInitialPrompt("");

    // make a copy so that the second call to setEvents here doesn't blow away the first. Why?
    const myEvents = [...events, { prompt }];
    setEvents(myEvents);

    const body = {
      prompt,
      input_image: lastImage,
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let prediction = await response.json();
    
    console.log("API Response status:", response.status);
    console.log("API Response data:", prediction);

    if (response.status !== 201) {
      console.error("API Error:", prediction);
      setError(prediction.detail || t('apiError'));
      setIsProcessing(false);
      return;
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }

      // just for bookkeeping
      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        setEvents(
          myEvents.concat([
            { image: prediction.output },
          ])
        );
      }
    }

    setIsProcessing(false);
  };

  const startOver = async (e) => {
    e.preventDefault();
    setEvents(events.slice(0, 1));
    setError(null);
    setIsProcessing(false);
    setInitialPrompt(seed.prompt);
  };

  // 动态生成URL
  const baseUrl = getBaseUrl();
  const currentUrl = getLocalizedUrl(currentLanguage);
  const canonicalUrl = getCanonicalUrl(currentLanguage);

  return (
    <div suppressHydrationWarning={true}>
      <Head>
        <title>van Gogh AI - Paint by Text: Ideas to Stunning Visuals</title>
        <meta name="description" content="Paint by Text - Turn your written ideas into stunning visuals. No art skills needed! Perfect for every place.Try now for instant, professional visuals!" />
        <meta name="keywords" content="van Gogh ai,Paint by Text,InstructPix2Pix,AI image editing Online,image generation,artistic style transformation" />
        <meta name="author" content="van Gogh ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content="van Gogh AI - Paint by Text: Ideas to Stunning Visuals" />
        <meta property="og:description" content="Paint by Text - Turn your written ideas into stunning visuals. No art skills needed! Perfect for every place.Try now for instant, professional visuals!" />
        <meta property="og:image" content={`${baseUrl}/opengraph.jpg`} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content="van Gogh AI - Paint by Text: Ideas to Stunning Visuals" />
        <meta property="twitter:description" content="Paint by Text - Turn your written ideas into stunning visuals. No art skills needed! Perfect for every place.Try now for instant, professional visuals!" />
        <meta property="twitter:image" content={`${baseUrl}/opengraph.jpg`} />
        
        {/* Language alternates */}
        {Object.keys(languages).map(langCode => (
          <link 
            key={langCode}
            rel="alternate" 
            hrefLang={langCode} 
            href={getLocalizedUrl(langCode)} 
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={getLocalizedUrl('en')} />
        
        {/* Additional SEO */}
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content={currentLanguage === 'zh' ? 'zh-CN' : currentLanguage === 'ar' ? 'ar' : 'en-US'} />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <meta name="theme-color" content="#667eea" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": t('appName'),
              "description": t('appSubtitle'),
              "applicationCategory": "ImageEditor",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "operatingSystem": "Web Browser"
            })
          }}
        />
      </Head>

      <main className="container max-w-[1400px] mx-auto p-6">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex items-center justify-center w-full rounded-xl bg-slate-800/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-slate-600 hover:bg-slate-700 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75 transition-all duration-200 shadow-lg"
                onClick={() => {
                  const selector = document.getElementById('language-selector');
                  selector.classList.toggle('hidden');
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {languages[currentLanguage]}
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div id="language-selector" className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white/95 backdrop-blur-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40 max-h-64 overflow-y-auto">
              <div className="py-1">
                {Object.entries(languages).map(([code, name]) => (
                  <button
                    key={code}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center ${
                      currentLanguage === code
                        ? 'bg-indigo-100 text-indigo-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleLanguageChange(code)}
                  >
                    {currentLanguage === code && (
                      <svg className="w-4 h-4 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="premium-hero-card mb-8 text-center">
          <div className="hero-backdrop"></div>
          <div className="relative z-10">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 hero-title leading-relaxed">
            {t('appName')}
          </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">{t('heroTitle')}</h2>
            <p className="text-lg md:text-xl mb-6 leading-relaxed text-slate-700 max-w-2xl mx-auto">
              {t('heroDescription')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
              <div className="premium-feature-card bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-bold text-blue-900 mb-2 text-sm">{t('creativeDesign')}</h3>
                <p className="text-xs text-blue-700">{t('creativeDesignDesc')}</p>
              </div>
              <div className="premium-feature-card bg-gradient-to-br from-emerald-50 to-teal-100">
                <div className="text-2xl mb-2">📸</div>
                <h3 className="font-bold text-emerald-900 mb-2 text-sm">{t('smartTransformation')}</h3>
                <p className="text-xs text-emerald-700">{t('smartTransformationDesc')}</p>
              </div>
              <div className="premium-feature-card bg-gradient-to-br from-purple-50 to-violet-100">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-bold text-purple-900 mb-2 text-sm">{t('instantMagic')}</h3>
                <p className="text-xs text-purple-700">{t('instantMagicDesc')}</p>
              </div>
            </div>
            
            <p className="text-sm mb-4 text-slate-500 font-medium">
              Powered by InstructPix2Pix - The World's Most Advanced Free AI Image Editor
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs mb-6">
              <span className="premium-badge bg-gradient-to-r from-blue-500 to-blue-600">{t('freeForever')}</span>
              <span className="premium-badge bg-gradient-to-r from-emerald-500 to-emerald-600">{t('instructPix2PixTech')}</span>
              <span className="premium-badge bg-gradient-to-r from-purple-500 to-purple-600">{t('noRegistration')}</span>
              <span className="premium-badge bg-gradient-to-r from-orange-500 to-orange-600">{t('unlimitedUsage')}</span>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">25K+</div>
                <div className="text-xs text-slate-600 font-medium">{t('activeCreators')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-1">1.2K+</div>
                <div className="text-xs text-slate-600 font-medium">{t('imagesPerHour')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">4.9</div>
                <div className="text-xs text-slate-600 font-medium">{t('userRating')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Chat Interaction Area */}
          <div className="lg:col-span-2">
            <div className="premium-chat-card">
              <Messages
                events={events}
                isProcessing={isProcessing}
                currentLanguage={currentLanguage}
                t={t}
                onUndo={(index) => {
                  setInitialPrompt(events[index - 1].prompt);
                  setEvents(
                    events.slice(0, index - 1).concat(events.slice(index + 1))
                  );
                }}
              />

              <div id="chat-input-area">
              <PromptForm
                initialPrompt={initialPrompt}
                isFirstPrompt={events.length === 1}
                onSubmit={handleSubmit}
                disabled={isProcessing}
                events={events}
                startOver={startOver}
                handleImageDropped={handleImageDropped}
                currentLanguage={currentLanguage}
                t={t}
              />
              </div>

              <div className="mx-auto w-full">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6">
                    <b>{t('error')}:</b> {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Guide Panels - Sticky Scroll */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-thumb-slate-300 lg:scrollbar-track-slate-100">
            {/* Technology Guide */}
            <div className="premium-guide-card">
              <h3 className="text-xl font-bold mb-4 text-center text-slate-800">🎨 {t('instructPix2PixTechnology')}</h3>
              <div className="mb-4 relative group">
                <Image
                  src="/what can InstructPix2Pix do.webp"
                  alt="InstructPix2Pix AI image editing examples"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform group-hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer';
                    modal.style.zIndex = '9999';
                    modal.innerHTML = `
                      <div class="relative max-w-4xl max-h-full p-4">
                        <img src="/what can InstructPix2Pix do.webp" alt="InstructPix2Pix AI image editing examples" class="max-w-full max-h-full rounded-lg">
                        <button class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">&times;</button>
                      </div>
                    `;
                    modal.onclick = (e) => {
                      if (e.target === modal) {
                        document.body.removeChild(modal);
                      }
                    };
                    const closeBtn = modal.querySelector('button');
                    closeBtn.onclick = () => document.body.removeChild(modal);
                    document.body.appendChild(modal);
                  }}
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-medium pointer-events-none">
                    Click to expand
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p className="text-slate-700">{t('step1')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p className="text-slate-700">{t('step2')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p className="text-slate-700">{t('step3')}</p>
                </div>
              </div>
            </div>

            {/* AI Prompt Gallery */}
            <div className="premium-guide-card">
              <h3 className="text-xl font-bold mb-4 text-center text-slate-800">✨ {t('aiPromptGallery')}</h3>
              <p className="text-center text-slate-600 mb-4 text-sm">
                {t('clickPromptToApply')}
              </p>
              
              {/* Art Styles */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 text-slate-700">🎨 {t('artStyles')}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "convert to Van Gogh painting style",
                    "make it look like Monet impressionist art",
                    "transform into digital art style",
                    "apply watercolor painting effect",
                    "convert to oil painting masterpiece"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      className="premium-prompt-button text-left p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 text-sm group"
                      onClick={(e) => {
                        e.preventDefault();
                        setPromptFromButton(prompt);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">🎨</span>
                        <span className="group-hover:text-blue-600 transition-colors">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scene Changes */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 text-slate-700">🌟 {t('sceneChanges')}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "change the background to sunset sky",
                    "add beautiful cherry blossoms",
                    "make it snow in the scene",
                    "add golden hour lighting",
                    "transform to nighttime with stars"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      className="premium-prompt-button text-left p-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-all duration-200 text-sm group"
                      onClick={(e) => {
                        e.preventDefault();
                        setPromptFromButton(prompt);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">🌟</span>
                        <span className="group-hover:text-emerald-600 transition-colors">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Enhancement */}
              <div>
                <h4 className="font-medium text-sm mb-2 text-slate-700">🎨 {t('colorEnhancement')}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "make colors more vibrant and bright",
                    "add warm golden tones",
                    "apply cool blue color grading",
                    "increase contrast and saturation",
                    "make it black and white vintage"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      className="premium-prompt-button text-left p-3 bg-gradient-to-r from-orange-50 to-pink-50 hover:from-orange-100 hover:to-pink-100 rounded-lg border border-orange-200 hover:border-orange-300 transition-all duration-200 text-sm group"
                      onClick={(e) => {
                        e.preventDefault();
                        setPromptFromButton(prompt);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">🎨</span>
                        <span className="group-hover:text-orange-600 transition-colors">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="premium-guide-card">
              <h3 className="text-lg font-bold mb-3 text-center text-slate-800">⚡ {t('quickActions')}</h3>
              <p className="text-center text-slate-500 mb-3 text-xs">
                {t('oneClickTransformations')}
              </p>
              <div className="space-y-2">
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("convert to Van Gogh painting style");
                }}>
                  🎨 Van Gogh Style
                </button>
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("add beautiful sunset background");
                }}>
                  🌅 Sunset Background
                </button>
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("make colors more vibrant and bright");
                }}>
                  ✨ Enhance Colors
                </button>
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("add snow falling in winter scene");
                }}>
                  ❄️ Winter Scene
                </button>
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("transform to black and white vintage photo");
                }}>
                  📷 Vintage B&W
                </button>
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("add golden hour warm lighting");
                }}>
                  🌇 Golden Hour
                </button>
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("make it anime art style");
                }}>
                  🎯 Anime Style
                </button>
                <button className="w-full premium-action-button text-left" onClick={(e) => {
                  e.preventDefault();
                  setPromptFromButton("add beautiful cherry blossom petals");
                }}>
                  🌸 Cherry Blossoms
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Area */}
        <div className="mt-16 space-y-12">
          {/* Core Features */}
          <div className="premium-content-card">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-slate-800">{t('whyChooseVanGogh')}</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t('whyChooseDescription')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="premium-feature-showcase bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">🎯</div>
                <h3 className="text-lg font-bold mb-2 text-blue-900">{t('intuitiveTextCommands')}</h3>
                <p className="text-sm text-blue-800">{t('intuitiveTextCommandsDesc')}</p>
              </div>
              
              <div className="premium-feature-showcase bg-gradient-to-br from-emerald-50 to-emerald-100">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">🖼️</div>
                <h3 className="text-lg font-bold mb-2 text-emerald-900">{t('smartImageEditing')}</h3>
                <p className="text-sm text-emerald-800">{t('smartImageEditingDesc')}</p>
              </div>
              
              <div className="premium-feature-showcase bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">🎨</div>
                <h3 className="text-lg font-bold mb-2 text-purple-900">{t('artisticStyleMastery')}</h3>
                <p className="text-sm text-purple-800">{t('artisticStyleMasteryDesc')}</p>
              </div>
              
              <div className="premium-feature-showcase bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">⚡</div>
                <h3 className="text-lg font-bold mb-2 text-orange-900">{t('lightningFastProcessing')}</h3>
                <p className="text-sm text-orange-800">{t('lightningFastProcessingDesc')}</p>
              </div>
              
              <div className="premium-feature-showcase bg-gradient-to-br from-pink-50 to-pink-100">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">🔓</div>
                <h3 className="text-lg font-bold mb-2 text-pink-900">{t('completelyFreeForever')}</h3>
                <p className="text-sm text-pink-800">{t('completelyFreeForeverDesc')}</p>
              </div>
              
              <div className="premium-feature-showcase bg-gradient-to-br from-teal-50 to-teal-100">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">🛡️</div>
                <h3 className="text-lg font-bold mb-2 text-teal-900">{t('privacyFirstDesign')}</h3>
                <p className="text-sm text-teal-800">{t('privacyFirstDesignDesc')}</p>
              </div>
            </div>
          </div>

          {/* User Testimonials */}
          <div className="premium-content-card">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-slate-800">{t('lovedByCreativeProfessionals')}</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t('testimonialsDescription')}</p>
            </div>
            
            {/* Scrolling testimonials container */}
            <div className="relative overflow-hidden">
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white to-transparent z-10"></div>
              
              {/* Scrolling content - infinite loop */}
              <div className="flex animate-scroll hover:pause-scroll" style={{ animationDuration: '40s' }}>
                {/* First set of testimonials */}
                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      👨‍🎨
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Alex Chen</div>
                      <div className="text-sm text-slate-600">Digital Artist, NYC</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"van Gogh ai has completely transformed my creative workflow. I can iterate on ideas faster than ever before!"</p>
                </div>

                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      👩‍🎨
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Sarah Martinez</div>
                      <div className="text-sm text-slate-600">Creative Director, LA</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"The quality of AI-generated edits is mind-blowing. It's like having a professional designer on demand."</p>
                </div>

                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      🎭
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Michael Johnson</div>
                      <div className="text-sm text-slate-600">Photographer, Chicago</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"Free, powerful, and incredibly intuitive. This tool has become essential for my photo editing workflow."</p>
                </div>

                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      🎨
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Emma Wilson</div>
                      <div className="text-sm text-slate-600">UI Designer, San Francisco</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"The artistic style transformations are incredible. I can create mockups and concepts in minutes instead of hours."</p>
                </div>

                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      🖌️
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">David Lee</div>
                      <div className="text-sm text-slate-600">Content Creator, Austin</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"Perfect for creating engaging social media content. The results are always professional and eye-catching."</p>
                </div>

                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      🎬
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Lisa Rodriguez</div>
                      <div className="text-sm text-slate-600">Art Director, Miami</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"Game-changing technology for creative professionals. The text-to-edit feature is revolutionary."</p>
                </div>

                {/* Duplicate set for infinite scroll effect */}
                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      👨‍🎨
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Alex Chen</div>
                      <div className="text-sm text-slate-600">Digital Artist, NYC</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"van Gogh ai has completely transformed my creative workflow. I can iterate on ideas faster than ever before!"</p>
                </div>

                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      👩‍🎨
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Sarah Martinez</div>
                      <div className="text-sm text-slate-600">Creative Director, LA</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"The quality of AI-generated edits is mind-blowing. It's like having a professional designer on demand."</p>
                </div>

                <div className="flex-shrink-0 w-80 mx-4 p-6 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      🎭
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-slate-800">Michael Johnson</div>
                      <div className="text-sm text-slate-600">Photographer, Chicago</div>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">"Free, powerful, and incredibly intuitive. This tool has become essential for my photo editing workflow."</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="premium-content-card">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-slate-800">{t('faq')}</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t('faqDescription')}</p>
            </div>
            
            {/* FAQ items */}
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('faqQ1')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                    <p>{t('faqA1')}</p>
                  </div>
                </div>
              </div>

              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('faqQ2')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                                          <p>{t('faqA2')}</p>
                  </div>
                </div>
              </div>

              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('faqQ3')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                                          <p>{t('faqA3')}</p>
                  </div>
                </div>
              </div>

              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('faqQ4')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                                          <p>{t('faqA4')}</p>
                  </div>
                </div>
              </div>

              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('faqQ5')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                                          <p>{t('faqA5')}</p>
                  </div>
                </div>
              </div>

              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('faqQ6')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                                          <p>{t('faqA6')}</p>
                  </div>
                </div>
              </div>

              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('faqQ7')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                                          <p>{t('faqA7')}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="faq-item border border-slate-200 rounded-lg overflow-hidden">
                <div className="faq-question cursor-pointer p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex justify-between items-center"
                     onClick={(e) => {
                       const answer = e.currentTarget.nextElementSibling;
                       const isOpen = answer.style.maxHeight;
                       if (isOpen) {
                         answer.style.maxHeight = null;
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                       } else {
                         answer.style.maxHeight = answer.scrollHeight + "px";
                         e.currentTarget.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
                       }
                     }}>
                  <h3 className="text-lg font-semibold text-slate-800">{t('needMoreHelp')}</h3>
                  <span className="faq-icon text-slate-600 text-xl transition-transform duration-200">⌄</span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="p-6 text-slate-700">
                    <p>{t('contactForMoreQuestions')}</p>
                    {currentLanguage !== 'en' && (
                      <p className="text-slate-600 text-sm italic mt-3">{t('useEnglishTip')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// 生成所有支持的语言路径
export async function getStaticPaths() {
  const paths = Object.keys(languages).map((lang) => ({
    params: { lang },
  }));

  return {
    paths,
    fallback: false, // 只预生成支持的语言，其他返回404
  };
}

// 静态生成时获取props
export async function getStaticProps(context) {
  const { lang } = context.params;
  
  // 双重检查：如果语言不支持，不应该到达这里（因为fallback: false）
  if (!languages[lang]) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      lang, // 传递语言参数给组件
    },
    revalidate: false, // 静态生成，不需要重新验证
  };
} 