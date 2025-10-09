import React from 'react';

const Title = ({ title, subtitle, align }) => {
  return (
    <div
      className={`flex flex-col justify-center ${
        align === 'left' ? 'items-start text-left md:items-start md:text-left' : 'items-center text-center'
      }`}
    >
      <h1 className='font-semibold text-3xl md:text-[35px]'>{title}</h1>
      <p className='text-[18px] font-light md:text-base text-gray-500/90 mt-2 max-w-155'>
        {subtitle}
      </p>
    </div>
  );
};

export default Title;
