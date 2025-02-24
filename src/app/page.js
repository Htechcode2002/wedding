"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import anime from 'animejs';
import Masonry from 'react-masonry-css';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [floatingItems, setFloatingItems] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [page, setPage] = useState(0);
  const [text, setText] = useState('');
  const [viewMode, setViewMode] = useState('book'); // 'book' | 'grid' | 'slide'
  const bookRef = useRef();
  const audioRef = useRef();
  const [hasInteracted, setHasInteracted] = useState(false);  // 添加交互狀態

  const images = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200",
  ];

  const descriptions = [
    "The Perfect Moment",
    "Beautiful Bride",
    "Eternal Promise",
    "Love in Bloom",
    "Celebration of Love"
  ];

  // 處理點擊開始
  const handleStart = () => {
    setHasInteracted(true);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (showIntro && hasInteracted) {
      const fullText = "On this special day, two hearts become one. Welcome to our love story...";
      let currentIndex = 0;

      const typingAnimation = anime.timeline({
        complete: () => {
          setTimeout(() => setShowIntro(false), 2000);
        }
      });

      typingAnimation
        .add({
          targets: '.cursor',
          opacity: [0, 1],
          duration: 1,
          easing: 'steps(1)',
          loop: true
        })
        .add({
          duration: 4000,
          update: function(anim) {
            const progress = Math.floor((fullText.length * anim.progress) / 100);
            if (progress > currentIndex) {
              currentIndex = progress;
              setText(fullText.slice(0, currentIndex));
            }
          },
        })
        .add({
          targets: '.typing-text',
          opacity: 0,
          duration: 1500,
          easing: 'easeOutExpo',
          delay: 1500
        });
    }
  }, [showIntro, hasInteracted]);

  // 在客戶端生成漂浮元素
  useEffect(() => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 10 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.2,
      isFlower: Math.random() > 0.5
    }));
    setFloatingItems(items);
  }, []);

  // 添加翻頁處理函數
  const handlePrevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
      setPage(bookRef.current.pageFlip().getCurrentPageIndex());
    }
  };

  const handleNextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
      setPage(bookRef.current.pageFlip().getCurrentPageIndex());
    }
  };

  // 添加頁面變化監聽
  const onPage = (e) => {
    setPage(e.data);
  };

  // 添加視圖模式說明
  const viewModeInfo = {
    book: { icon: '📖', label: '翻頁模式' },
    grid: { icon: '📑', label: '瀑布流' },
    slide: { icon: '🖼️', label: '幻燈片' }
  };

  const renderContent = () => {
    switch(viewMode) {
      case 'grid':
        return (
          <div className="w-full h-[calc(100dvh-140px)] overflow-hidden">
            <div className="h-full overflow-y-auto px-2 md:px-4 overscroll-none">
              <div className="text-center text-gray-500 mb-4">
                點擊照片可以進入幻燈片模式
              </div>
              <Masonry
                breakpointCols={{
                  default: 4,
                  1536: 3,
                  1280: 3,
                  1024: 2,
                  768: 2,
                  640: 1
                }}
                className="flex w-auto"
                columnClassName="pl-4 bg-clip-padding first:pl-0"
              >
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="mb-4 relative group cursor-pointer"
                    onClick={() => {
                      setViewMode('slide');
                      setPage(index);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={image}
                          alt={descriptions[index]}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-center text-white text-lg font-serif drop-shadow-lg">
                          {descriptions[index]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </div>
          </div>
        );

      case 'slide':
        return (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* 返回按鈕 */}
            <button
              onClick={() => setViewMode('grid')}
              className="absolute bottom-6 left-6 z-50 text-white/80 hover:text-white 
                flex items-center gap-2 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all"
            >
              <span>←</span>
              <span className="hidden md:inline">返回瀑布流</span>
            </button>

            {/* 關閉按鈕 */}
            <button
              onClick={() => setViewMode('book')}
              className="absolute bottom-6 right-6 z-50 text-white/80 hover:text-white 
                p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all"
            >
              ✕
            </button>

            {/* 鍵盤操作提示 */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              使用 ← → 方向鍵或點擊兩側切換照片
            </div>

            {/* 主圖片容器 */}
            <div className="flex-1 relative flex items-center justify-center p-8">
              {/* 當前圖片 */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full" style={{ maxHeight: '80vh' }}>
                  <Image
                    src={images[page]}
                    alt={descriptions[page]}
                    fill
                    className="object-contain"
                    priority
                    quality={100}
                    sizes="100vw"
                  />
                </div>
              </div>

              {/* 漸變遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

              {/* 導航按鈕 - 左 */}
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-8 transition-all hover:scale-110"
                disabled={page === 0}
              >
                <span className="text-4xl">←</span>
              </button>

              {/* 導航按鈕 - 右 */}
              <button
                onClick={() => setPage(p => Math.min(images.length - 1, p + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-8 transition-all hover:scale-110"
                disabled={page === images.length - 1}
              >
                <span className="text-4xl">→</span>
              </button>
            </div>

            {/* 底部信息區 */}
            <div className="relative z-10">
              {/* 圖片描述 */}
              <div className="text-center py-4">
                <p className="text-white text-2xl font-serif tracking-wider">
                  {descriptions[page]}
                </p>
              </div>

              {/* 進度指示器 */}
              <div className="flex justify-center gap-3 pb-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      page === i 
                        ? 'w-8 bg-white' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>

              {/* 縮略圖列表 */}
              <div className="bg-black/80 backdrop-blur-sm">
                <div className="flex gap-2 p-4 justify-center">
                  {images.map((image, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`relative h-16 w-16 rounded-lg overflow-hidden transition-all ${
                        page === i 
                          ? 'ring-2 ring-white scale-110 z-10' 
                          : 'opacity-50 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={descriptions[i]}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative">
            <div className="book-shadow flex-1 max-h-[70vh] md:max-h-[80vh] flex items-center">
              <HTMLFlipBook
                width={400}
                height={533}
                size="stretch"
                minWidth={300}
                maxWidth={400}
                minHeight={400}
                maxHeight={533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className="book"
                flippingTime={1000}
                ref={bookRef}
                drawShadow={true}
                usePortrait={true}
                startPage={0}
                style={{ backgroundColor: 'transparent' }}
                startZIndex={0}
                autoSize={true}
                onFlip={onPage}
              >
                {/* 封面 - 改用照片背景 */}
                <div className="page page-cover">
                  <div className="page-content relative">
                    <Image
                      src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200"  // 優雅的婚紗照片
                      alt="Wedding Cover"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                      <h2 className="text-5xl font-serif text-white text-center drop-shadow-lg">
                        Our Wedding
                        <br />
                        Album
                      </h2>
                    </div>
                  </div>
                </div>

                {/* 內頁 */}
                {images.map((image, index) => (
                  <div key={index} className="page">
                    <div className="page-content">
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={descriptions[index]}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-4">
                          <p className="text-center text-xl font-serif text-white">
                            {descriptions[index]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 封底 */}
                <div className="page page-cover">
                  <div className="page-content">
                    <p className="text-2xl font-serif text-[#614434] text-center p-8 bg-[#e6d5c7]">
                      The End
                    </p>
                  </div>
                </div>
              </HTMLFlipBook>
            </div>
            {/* 添加頁數顯示 */}
            <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-[#614434]/70 text-sm">
              {page + 1} / {images.length + 2}
            </div>
          </div>
        );
    }
  };

  // 添加鍵盤控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode === 'slide') {
        if (e.key === 'ArrowLeft') {
          setPage(p => Math.max(0, p - 1));
        } else if (e.key === 'ArrowRight') {
          setPage(p => Math.min(images.length - 1, p + 1));
        } else if (e.key === 'Escape') {
          setViewMode('grid');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, images.length]);

  return (
    <>
      {/* 音樂元素移到最外層 */}
      {isPlaying && (
        <audio ref={audioRef} autoPlay loop className="hidden" src="/music/love.mp3" />
      )}

      {showIntro ? (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
          {!hasInteracted ? (
            <div className="text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-serif text-gray-700 mb-8">
                Calvin & Jestina
              </h1>
              <button
                onClick={handleStart}
                className="bg-white/80 px-8 py-4 rounded-full shadow-lg hover:bg-white/90 
                  transition-all text-xl font-serif text-gray-700 hover:scale-105
                  border border-pink-100 hover:border-pink-200"
              >
                ✧ 點擊開啟我們的愛情故事 ✧
              </button>
              <p className="text-sm text-gray-500 mt-4 animate-pulse">
                開啟音效以獲得最佳體驗
              </p>
            </div>
          ) : (
            <div className="typing-text text-center px-4">
              <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-800 leading-relaxed">
                {text}
                <span className="cursor inline-block w-[4px] h-[50px] bg-gray-800 ml-1 align-middle animate-blink">
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <main className="fixed inset-0 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
          {/* 背景裝飾 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,228,230,0.6),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,241,242,0.6),transparent_40%)]" />
          <div className="absolute inset-0 backdrop-blur-[100px]" />
          
          {/* 漂浮的愛心或花瓣效果 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingItems.map((item) => (
              <div
                key={item.id}
                className="absolute animate-float"
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  animation: `float ${item.duration}s linear infinite`,
                  opacity: item.opacity,
                }}
              >
                {item.isFlower ? '🌸' : '♡'}
              </div>
            ))}
          </div>

          {/* 內容區域 */}
          <div className="h-full w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-serif text-[#614434] mb-4 relative z-10">
              Our Love Story
            </h1>
            {renderContent()}
          </div>

          {/* 控制按鈕 */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white/90 p-3 md:p-4 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100"
            >
              {isPlaying ? "🎵" : "🔈"}
            </button>
          </div>
          <div className="fixed bottom-6 left-6 z-50 flex gap-2">
            {Object.entries(viewModeInfo).map(([mode, { icon, label }]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`group relative p-3 md:p-4 rounded-full transition-all ${
                  viewMode === mode 
                    ? 'bg-black text-white' 
                    : 'bg-white/90 hover:bg-white'
                }`}
              >
                {icon}
                {/* 懸浮提示 - 改為向上顯示 */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap 
                  bg-black/80 text-white text-xs md:text-sm py-1 px-2 rounded opacity-0 
                  group-hover:opacity-100 transition-opacity">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </main>
      )}
    </>
  );
}
