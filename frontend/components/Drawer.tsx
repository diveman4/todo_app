import {useState, ElementType} from "react";
import {DarkMode, LightMode, Menu} from "@mui/icons-material";
import {Button, List, ListItemButton, ListItemIcon, ListItem, Drawer, Box } from "@mui/material";

type MenuItem = {
    title: string;
    icon: ElementType;
}

//表示メニュー
const menu: MenuItem[] = [
    {title: "ライトモード", icon: LightMode},
    {title: "ダークモード", icon: DarkMode},
]

export default function MaterialDrawer() {
    //フラグ
    const [show, setShow] = useState<boolean>(false);
    //ボタンクリック時に呼び出されるハンドラー
    const handleDrawer = ():void => setShow(!show);

    return (
        <>
        <Button onClick={handleDrawer}><Menu /></Button>
        <Drawer anchor="left" open={show}>
            <Box sx={{height: '100vh'}} onClick={handleDrawer}>
                <List>
                    {menu.map((obj: MenuItem) => {
                        const Icon = obj.icon;
                        return (
                            <ListItem key={obj.title}>
                                <ListItemButton>
                                    <ListItemIcon><Icon /></ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        )
                    })};
                </List>
            </Box>
        </Drawer>
        </>
    );
}