import React, {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next"
import C1DataTable from 'app/c1component/C1DataTable';
import C1DataTableActions from 'app/c1component/C1DataTableActions';
import C1ListPanel from "app/c1component/C1ListPanel";
import useHttp from "app/c1hooks/http";
import ConfirmationDialog from "matx/components/ConfirmationDialog";
import {formatDate} from "../../../c1utils/utility";
import useAuth from "../../../hooks/useAuth";
import C1PopUp from "../../../c1component/C1PopUp";
import UserPopUpMessage from "../messagePopUp/PrivateChatPopUpMessage";
import {Snackbar} from "@material-ui/core";
import C1Alert from "../../../c1component/C1Alert";
import {useHistory} from "react-router-dom";
import {MatxLoading} from "../../../../matx";
import {getStatusDesc} from "../../../c1utils/statusUtils";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
// Function to refresh access token
const refreshAccessToken = async (refreshToken) => {
    console.log("refreshToken", refreshToken)
    const response = await fetch('http://localhost:8080/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log("data", data)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('accessTokenExpiry', data.expiredAt); // Store expiry time
        return data.accessToken;
    } else {
        console.error('Failed to refresh access token');
        return null;
    }
};

const getValidToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiry = localStorage.getItem('expiredAt');
    const currentTime = new Date().getTime() / 1000; // Current time in seconds

    // Log the expiration time
    console.log('Access token expired', expiry);
    console.log('refreshToken', refreshToken);

    // If there's no expiry or token is expired, try refreshing
    if (accessToken && (expiry === null || currentTime > expiry)) {
        console.log('Access token expired or no expiry found, trying to refresh it...');
        const newToken = await refreshAccessToken(refreshToken);
        console.log("newToken", newToken)

        // If refresh is successful, store the new access token and expiry
        if (newToken) {
            localStorage.setItem('accessToken', newToken.token);
            localStorage.setItem('accessTokenExpiry', newToken.expiredAt);
            return newToken.token;
        }
    }

    return accessToken; // Return the current access token if not expired or refreshing failed
};

const UsersList = () => {

    const auth = useAuth();
    const isAdmin = auth?.user?.roles?.some(role => role?.name === 'ROLE_ADMIN')
    const isStudent = auth?.user?.roles?.some(role => role?.name === 'ROLE_STUDENT')
    const authUser = useAuth();
    let username = authUser?.user?.username;

    const { t } = useTranslation(["student", "common"]);
    const [confirm, setConfirm] = useState({ id: null });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState("");
    const [openPopUp, setOpenPopUp] = useState(false);
    const [errors, setErrors] = useState({});
    const [popUpUsername, setPopUpUsername] = useState("");
    const [sender, setSender] = useState("");
    const [messageCount, setMessageCount] = useState(0);
    const [isRefresh, setRefresh] = useState(false);
    const [refreshKey, setRefreshKey] = useState(Date.now());
    const [message, setMessage] = useState([]);
    const history = useHistory();
    const [isSubmitSuccess, setSubmitSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [input, setInput] = useState('');
    const stompClientRef = useRef(null);
    const { isLoading, isFormSubmission, res, validation, error, urlId, sendRequest } = useHttp();

    const [snackBarState, setSnackBarState] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        msg: "",
        severity: "success",
        redirectUrl: ''
    });
    const columns = [
        {
            name: "id",
            label: "ID",
        },
        {
            name: "username",
            label: "Username",
            options: {
                filter: true,
                display: true,
                viewColumns: false,
            },
        },
        {
            name: "messageCount",
            options: {
                filter: false,
                display: false,
                viewColumns: false,
            },
        },
        {
            name: "email",
            label: "Email",
            options: {
                filter: false
            },
        },
        {
            name: "fullName",
            label: "Name",
            options: {
                filter: false,
            },
        },
        {
            name: "dtOfBirth",
            label: "Date Of Birth",
            options: {
                filter: true,
                customBodyRender: (value) => {
                    return formatDate(value, true);
                }
            },
        },
        {
            name: "gender",
            label: "Gender",
            options: {
                filter: true,
            },
        },
        {
            name: "address",
            label: "Address",
            options: {
                filter: true,
            },
        },
        {
            name: "conNumber",
            label: "Phone Number",
            options: {
                filter: true
            },
        },
        {
            name: "usrDtCreate",
            label: "Created Date",
            options: {
                filter: true,
                customBodyRender: (value) => {
                    return formatDate(value, true);
                }
            },
        },
        {
            name: "status",
            label: "Status",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return getStatusDesc(value);
                },
            },
        },
        {
            name: "action",
            label: " ",
            options: {
                filter: false,
                display: true,
                viewColumns: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    let remarkCount = tableMeta.rowData[2];
                    return (<C1DataTableActions
                        editPath={!isStudent ? `/student/applicationStudent/edit/${tableMeta.rowData[0]}` : null}
                        viewPath={`/student/applicationStudent/view/${tableMeta.rowData[0]}`}
                        removeEventHandler={!isStudent ? (e) => handleDeleteConfirm(e, tableMeta.rowData[0]) : null}
                        // remarkPath={(e) => handleMessagePopUp(e)}
                        remarkPath={
                            isAdmin || remarkCount && remarkCount > 0
                                ? {onClick: (e) => handleMessagePopUp(e, tableMeta.rowData[1]),
                                    count: remarkCount}
                                : null
                        }
                    />);
                },
            },
        },
    ];

    useEffect(() => {
        setLoading(false)
        if (isStudent){
            const receiver = auth.user.username;
            sendRequest(`/receiver/${receiver}`, 'FETCH', 'GET', null);
        }
        if (urlId === "DELETE") {
            setOpen(false);
            setRefresh(true);
            setLoading(false);
        }
    }, [sender]);


    useEffect(() => {
        if (!isLoading && !error && res) {
            setLoading(false);
            switch (urlId) {
                case "FETCH":{
                    setMessage(res.data);
                    console.log("data", res.data?.[0]);
                    setSender(res.data?.[0]?.userSender?.username);
                    break;
                }
                case "DELETE": {
                    setLoading(false);
                    setOpen(false); // ✅ close the confirmation dialog
                    setSnackBarState({
                        ...snackBarState,
                        open: true,
                        msg: t("common:common.msg.deleted"),
                        severity: "success"
                    });
                    setSubmitSuccess(true);
                    break;
                }

                default:
                    break;
            }
            setRefresh(true);
        }
        if (validation) {
            //currently only tin is validated backend. TODO will have to change this to implement properly.
            setValidationErrors({ ...validation });
            setLoading(false);
        }

        if (error) {
            setLoading(false);
        }
        // eslint-disable-next-line
    }, [isLoading, res, error, urlId, history]);
    console.log("messages", messages)

    useEffect(() => {
        console.log("Messages state updated:", messages);
    }, [messages]);

    useEffect(() => {
        if (!username) return;

        const connectWebSocket = async () => {
            const token = await getValidToken(); // ✅ await here

            if (!token) {
                console.error('❌ No valid token available');
                return;
            }

            const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);

            const stompClient = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                reconnectDelay: 5000,
                onConnect: () => {
                    console.log('✅ Connected');
                    setIsConnected(true);

                    // stompClient.subscribe(`/user/${username}/queue/messages`, (message) => {
                    //     const msg = JSON.parse(message.body);
                    //     setMessages((prev) => [...prev, msg]);
                    // });
                    stompClient.subscribe(`/user/${username}/queue/messages`, (message) => {
                        const data = JSON.parse(message.body);

                        if (Array.isArray(data)) {
                            setMessages(data.reverse()); // ← This makes "Hi" show up at the top visually
                        } else {
                            setMessages((prev) => [...prev, data]);
                        }
                        setRefresh(prevState => !prevState)
                    });


                    stompClient.publish({
                        destination: '/app/chat.getMessages',
                        body: JSON.stringify({
                            sender: username,
                            receiver: isStudent ? sender : popUpUsername,
                        }),
                    });
                },
                onStompError: (frame) => {
                    console.error('❌ STOMP Error', frame);
                },
            });

            stompClient.activate();
            stompClientRef.current = stompClient;
        };

        connectWebSocket(); // 🚀 Launch the async function

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [username, popUpUsername]);
    const sendMessage = () => {
        if (!input.trim() || !popUpUsername || !stompClientRef.current?.connected) return;

        const message = {
            sender: username,
            receiver: isStudent ? sender : popUpUsername,
            content: input,
            type: 'CHAT',
        };

        stompClientRef.current.publish({
            destination: '/app/chat.sendPrivate',
            body: JSON.stringify(message),
        });

        setMessages((prev) => [...prev, message]);
        setInput('');
    };
    const handleConfirmAction = (e) => {
        setRefresh(false);
        if (confirmAction === "DELETE") {
            handleDeleteHandler(e);
        }
    }
    const handleDeleteHandler = (e) => {
        if (confirm && !confirm.id)
            return;
        setLoading(true);
        sendRequest("api/v1/users/" + confirm.id, "DELETE", "DELETE", {})
    }

    const handleDeleteConfirm = (e, id) => {
        setConfirmAction("DELETE");
        e.preventDefault();
        setConfirm({ ...confirm, id: id });
        setOpen(true);
    }

    const handleOnClose = (e) => {
        setOpenPopUp(false)
    }
    const handleMessagePopUp = (e, key) => {
        setLoading(false)
        setPopUpUsername(key)
        e.stopPropagation()
        setOpenPopUp(true);
        setErrors({});
    };
    const handleSnackbarClose = () => {
        setSnackBarState({ ...snackBarState, open: false });

        if (snackBarState && snackBarState.redirectUrl && snackBarState.severity === 'success') {
            //only redirect if it's success
            let url = snackBarState.redirectUrl;
            history.push(url);
        }
    };


    console.log("isStudent", isStudent)
    console.log("sender", sender)
    console.log("username", username)
    console.log("authUser", authUser)
    console.log("isRefresh", isRefresh)
    console.log("messageCount", messageCount)

    let snackBar;
    if (isSubmitSuccess) {
        const anchorOriginV = snackBarState.vertical;
        const anchorOriginH = snackBarState.horizontal;

        snackBar = (
            <Snackbar
                anchorOrigin={{ vertical: anchorOriginV, horizontal: anchorOriginH }}
                open={snackBarState.open}
                onClose={handleSnackbarClose}
                autoHideDuration={3000}
                key={anchorOriginV + anchorOriginH}
            >
                <C1Alert onClose={handleSnackbarClose} severity={snackBarState.severity}>
                    {snackBarState.msg}
                </C1Alert>
            </Snackbar>
        );
    }
    return (<React.Fragment>
            {snackBar}
            {isLoading && <MatxLoading />}
            {confirm && confirm.id && (
                <ConfirmationDialog
                    title={t("common:confirmMsgs.confirm.title")}
                    open={open}
                    text={t("common:confirmMsgs.confirm.content", {
                        action: confirmAction,
                        type: confirm.type,
                        id: confirm.id
                    })}
                    onYesClick={() => handleConfirmAction()}
                    onConfirmDialogClose={() => setOpen(false)}
                />
            )}

            <C1PopUp
                title={"Message Alert"}
                openPopUp={openPopUp}
                setOpenPopUp={setOpenPopUp}
                maxWidth="lg"
                maxHeight="500px"
                overflowY="auto"
                flex-wrap="none"
                customStyles={{
                    backgroundColor: "rgba(244,244,244,0.11)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    bottom: "100px",
                }}
                disableCloseButton={true}
            >
                <UserPopUpMessage
                    auth={auth}
                    input={input}
                    errors={errors}
                    sender={sender}
                    setInput={setInput}
                    messages={messages}
                    isStudent={isStudent}
                    username={username}
                    sendMessage={sendMessage}
                    popUpUsername={popUpUsername}
                    handleOnClose={handleOnClose}
                />
            </C1PopUp>
        <C1ListPanel
            routeSegments={[
                { name: "Application Student" },
            ]}>
            <C1DataTable 
                url={'/api/v1/users'}
                columns={columns}
                title={"Student List"}
                defaultOrder="usrDtCreate"
                isServer={true}
                isShowDownload={false}
                isShowPrint={false}
                isRowSelectable={false}
                isShowToolbar
                isRefresh={isRefresh}
                isShowFilter={!isStudent}
                filterBy={ isAdmin && [
                    { attribute: "id" , value : auth?.user?.id}
                ]}
                // defaultOrderDirection={"asc"}
                showAdd={ isAdmin && {
                 path: "/student/applicationStudent/new/0"}
                }
            />
        </C1ListPanel>
    </React.Fragment>
    );
};

export default UsersList;
