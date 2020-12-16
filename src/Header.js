import React, { useEffect, useState } from 'react';

function Header() {
    //TODO: Consider using React Context API for isDark. 
    // With Context API, 'isDark' can be accessed from any page even if there's more pages. 
    
    const [isDark, setIsDark] = useState(false);

    /**
     * Set theme when "Dark Mode" slider is changed. 
     */
    useEffect(() => {
        if (isDark) {
            document.body.dataset.theme = 'dark';
        } else {
            document.body.dataset.theme = 'light';
        }
      }, [isDark]);

    return (
        <header>
            <div>
                <h1>Weather Forecast</h1>
            </div>
            <div>
                Dark Mode &nbsp;
                <label className="switch">
                <input 
                    type="checkbox" 
                    defaultChecked={isDark}
                    onClick={e => setIsDark(!isDark)} />
                <span className="slider round"></span>
                </label>
            </div>
        </header>            
    );
}

export default Header;
