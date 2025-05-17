

const IconWithTitle = ({ icon: Icon, title, iconColor, backgroundColor, iconSize, titleColor, titleFontSize }) => {
  return (
    <div className='flex justify-center mb-4'>
      <Icon
        color={iconColor}
        style={{
          borderRadius: '50%',
          backgroundColor: backgroundColor,
          marginRight: 8,
          fontSize: iconSize,
          width: '50px',
          height: '50px',
          padding: '10px',
        }}
      />
      <h1
        className=' ml-5'
        style={{
          color: titleColor,
          fontSize: titleFontSize,
        }}
      >
        {title}
      </h1>
    </div>
  );
};

export default IconWithTitle;

