import { useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";

// routing
import Routes from "routes";

// defaultTheme
import themes from "themes";

// project imports
import NavigationScroll from "layout/NavigationScroll";
import { useEffect } from "react";

// ==============================|| APP ||============================== //

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 500, // Animation duration
      once: true, // Whether animation should happen only once
      easing: "ease-in-out", // Easing function for animation
      mirror: false, // Whether elements should animate out while scrolling past them
    });
  }, []);
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
