import Link from 'next/link';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center text-[#000000] px-4 py-8 pt-24">
      <div className="w-full sm:w-1/2 text-center mb-8 sm:mb-0 lg:pl-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-contact-purple to-contact-teal mb-4 font-playfair">
          Oops!
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-800 font-montserrat font-bold">
          We can&apos;t seem to find the page you&apos;re looking for.
        </p>
        <Link href="/">
          <button className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-contact-purple text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:bg-contact-teal transition-transform transform hover:scale-105 duration-300 font-serif">
            Go Back Home
          </button>
        </Link>
      </div>
      <div className="w-full sm:w-1/2 text-center">
        <Image
          src="/set8.jpg"
          alt="Page Not Found"
          width={300}
          height={300}
          className="mx-auto sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
        />
      </div>
    </div>
  );
};

export default NotFound;
