import './Notification.css';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { userCliend } from '../../../user-data/UserData';
import { environments } from '../../../environment/environment';
import { Link } from 'react-router-dom';

function Notification() {
    const [notiData, setNotiData] = useState<socketInterface>();
    const [timeOut, setTimeOut] = useState<NodeJS.Timeout>();

    const clearNoti = () => {
        const notificationModal = document.getElementById("noti-modal");
        if (!notificationModal) {
            return
        }
        notificationModal.style.transform = "translate(-50%,-100%)"
        notificationModal.style.marginTop = "0"
    }

    useEffect(() => {
        const resListener = (res: socketInterface) => {
            console.log(res)
            let timeCounter = 0
            setNotiData(res);
            const notificationModal = document.getElementById("noti-modal");

            if (!notificationModal) {
                return
            }

            notificationModal.style.transform = "translate(-50%,-100%)"
            notificationModal.style.marginTop = "0"

            clearTimeout(timeOut)

            notificationModal.style.transform = "translate(-50%,5%)"
            notificationModal.style.marginTop = "1rem"

            timeCounter = 2

            const interval = setInterval(() => {
                timeCounter -= 0.01

                if (timeCounter <= 0.35) {
                    notificationModal.style.transform = "translate(-50%,-100%)"
                    notificationModal.style.marginTop = "0"
                    clearTimeout(interval)
                }
            }, 10);

            setTimeOut(interval)

        }
        const socket = io(String(environments.baseUrl));

        socket.on(userCliend.userData?.userData.email + "-noti", resListener);

        return () => {
            socket.off(userCliend.userData?.userData.email + "-noti", resListener);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Link to={notiData?.path || "#"} onClick={clearNoti}>
            <div id='noti-modal' className="noti-modal">
                <div className="noti-header">
                    {notiData?.header}
                </div>
                <div className="noti-content">
                    {notiData?.content}
                </div>
            </div>
        </Link>
    );
}

export default Notification;
