import {useState} from "react";
import {CssBaseline, Button} from "@mui/material";
import {createTheme, ThemeProvider, PaletteMode} from "@mui/material/styles";
import {amber, grey} from "@mui/material/colors";

export default function MaterialMode() {
    //モード管理
    const [mode, setMode] = useState('light');
    //モード反転
    const toggleMode = ():void => setMode(prev => prev === 'light' ? 'dark' : 'light');
    //テーマ
    const theme = createTheme({
        palette: {
            mode: mode as PaletteMode,
            ...(mode === 'light'
                ? { primary: amber}
                :
                {primary: {main: grey[500], contrastText: '#fff'},
                background: {default: grey[900], paper: grey[900]},                secondary: amber,
                }
            ),
        },
    });
    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Button variant="contained" onClick={toggleMode}>
                Mode {mode}
            </Button>
        </ThemeProvider>
    );
}
