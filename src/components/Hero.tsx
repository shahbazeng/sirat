import { Search, Send, BookOpen, Scroll, Book, Library } from 'lucide-react';

export default function Hero() {
  return (
    <section className='bg-sirat-cream min-h-[80vh] flex flex-col items-center justify-center px-4 py-12'>
      <div className='max-w-4xl w-full text-center'>
        <h1 className='text-3xl md:text-5xl font-serif text-sirat-green mb-8 leading-tight font-medium'>
          Hidayat ka rasta, Quran aur Sunnah <br className='hidden md:block' /> ki roshni mein
        </h1>
        <div className='relative max-w-2xl mx-auto mb-3'>
          <input
            type='text'
            placeholder='Apna sawal yahan likhein (e.g., Huqoog-ul-Ibaad kya hain?)'
            className='w-full py-4 px-6 pr-14 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sirat-gold text-gray-700 bg-white'
          />
          <button className='absolute right-2 top-1/2 -translate-y-1/2 bg-sirat-gold p-2.5 rounded-full text-white hover:bg-opacity-90 transition-all'>
            <Send size={20} fill='currentColor' />
          </button>
        </div>
        <p className='text-sm text-gray-500 mb-12'>
          100% Verified References from <span className='font-semibold italic'>Sahih Bukhari & Muslim</span>
        </p>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Card icon={<BookOpen className='text-sirat-green' />} title='Al-Quran Al-Kareem' />
          <Card icon={<Scroll className='text-sirat-green' />} title='Sahih Bukharissss' />
          <Card icon={<Book className='text-sirat-green' />} title='Sunan Abi Dawud' />
          <Card icon={<Library className='text-sirat-green' />} title='Sunan an-Nasa&apos;i' />
        </div>
      </div>
    </section>
  );
}

// TypeScript ko batana par raha hai ke icon React ka element hai aur title ek string hai
interface CardProps {
  icon: React.ReactNode;
  title: string;
}

function Card({ icon, title }: CardProps) {
  return (
    <div className='bg-white/50 border border-gray-200 p-6 rounded-xl flex flex-col items-center gap-3 hover:border-sirat-gold transition-colors cursor-pointer group'>
      <div className='p-3 rounded-lg bg-gray-50 group-hover:bg-sirat-cream transition-colors'>
        {icon}
      </div>
      <h3 className='font-bold text-sm text-sirat-dark'>{title}</h3>
    </div>
  );
}