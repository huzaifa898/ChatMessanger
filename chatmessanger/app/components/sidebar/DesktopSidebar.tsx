'use client'
import useRoutes from "@/hooks/useRoutes"
import { useState } from "react"

const DestopSideBar = () => {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div>
         Destop side bar
        </div>
    );
}
export default DestopSideBar;