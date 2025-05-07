// ResponsiveLayout.js


import { useMediaQuery } from 'react-responsive';

const LayoutPage = ({ isSidebarClosed, children }) => {

  const isSmallScreen = useMediaQuery({ maxWidth: 1024 });

  const sidebarWidth = isSidebarClosed ? '0px' : '0px';
  const mainComponentWidth = isSmallScreen ? '100%' : `calc(100% - ${sidebarWidth})`;
  
  const styles = {
    width: mainComponentWidth,
    marginLeft: isSidebarClosed ? '50px' : (isSmallScreen ? '0' : '240px'),
    transition: 'width 0.3s, margin-left 0.3s',
  };
  return (
    <div style={styles}>
      {children}
    </div>
  );
};

export default LayoutPage;
