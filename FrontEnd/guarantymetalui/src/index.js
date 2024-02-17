import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // Dynamically update the document title
    document.title = "Guaranty Sheet Metal";

    // Dynamically update the favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'gsm_icon.png'; // Ensure this path is correct in your public folder
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return (
    <div>
      {/* Your app content here */}
    </div>
  );
};

export default App;
