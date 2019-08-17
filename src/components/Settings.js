import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { PhosPlayerContext } from "./PhosPlayerContext";

export default function FormDialog() {
    const { state, dispatch } = React.useContext(PhosPlayerContext);
    const { openSettings } = state

    let [phosConfigURL, setPhosConfigURL] = React.useState(localStorage.getItem("phosConfigURL"))
    let [proxyUrl, setProxyUrl] = React.useState(localStorage.getItem("security.proxyUrl"))
    let [authCode, setAuthCode] = React.useState(localStorage.getItem("security.authCode"))

    function handleClose() {
        dispatch({
            type: 'setPlayerConfig',
            payload: {
                name: 'openSettings',
                value: false
            }
        })
    }

    const handleSave = () => {
        localStorage.setItem("phosConfigURL", phosConfigURL)
        localStorage.setItem("security.proxyUrl", proxyUrl || '')
        localStorage.setItem("security.authCode", authCode || '')
        handleClose()
        // 清理分享链接，访问自己的配置
        window.location.href = window.location.origin
    }
    return (
        <div>
            <Dialog open={openSettings} onClose={handleClose}
                aria-labelledby="form-dialog-title"
                maxWidth={'md'}
                fullWidth
            >
                <DialogContent>
                    <h3>基础配置(访问公开数据)</h3>
                    <TextField
                        margin="dense"
                        id="configUrl"
                        label="Phos Config Table URL"
                        type="url"
                        value={phosConfigURL}
                        onChange={(e) => setPhosConfigURL(e.target.value)}
                        fullWidth
                        required
                    />
                </DialogContent>
                <DialogContent>
                    <h3>高级配置(访问私密数据)</h3>
                    <TextField
                        margin="dense"
                        id="proxy"
                        label="cloudflare proxy-worker url"
                        type="url"
                        value={proxyUrl || ''}
                        onChange={(e) => setProxyUrl(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="authCode"
                        label="authCode"
                        type="url"
                        value={proxyUrl || ''}
                        onChange={(e) => setAuthCode(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogContent>
                    <DialogContentText>
                        用 Phos 管理自己的音乐/播客？  <a target="_blank" href="https://www.notion.so/gine/Phos-9a31e68f8f004daaa5e79102ffd843d7">help?</a>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary" >
                        取消
                    </Button>
                    <Button onClick={handleSave} color="primary" >
                        保存
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
