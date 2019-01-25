import { prependOnceListener } from "cluster";

const Layout =  () => {
    <div>ToolBar, SideDrawer, BackDrop</div>
    <main>
        {prependOnceListener}
    </main>
}

export default Layout;