

const LogoComponent = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <span className="flex items-center text-[#f5f5f5]">
          <div className="flex items-center justify-center w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-lg text-2xl font-bold bg-gradient-to-r from-[#1a73e8] to-[#1a73e8] mr-2.5">
            M⁺
          </div>
          <h5 className="overflow-hidden whitespace-nowrap text-black text-xl leading-[30px] transition-opacity duration-300 opacity-100">
        MyRevision⁺
          </h5>
        </span>
      </div>
     
    </header>
  );
};

export default LogoComponent;