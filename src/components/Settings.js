import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { PhosPlayerContext } from "./PhosPlayerContext";
import Slider from '@material-ui/core/Slider';


export default function FormDialog() {
    const { state, dispatch } = React.useContext(PhosPlayerContext);
    const { openSettings } = state

    let [phosConfigURL, setPhosConfigURL] = React.useState(localStorage.getItem("phosConfigURL"))
    let [proxyUrl, setProxyUrl] = React.useState(localStorage.getItem("security.proxyUrl"))
    let [authCode, setAuthCode] = React.useState(localStorage.getItem("security.authCode"))
    let [background, setBackground] = React.useState(localStorage.getItem("style.background"))
    let [color, setColor] = React.useState(localStorage.getItem("style.color"))
    let [opacity, setOpacity] = React.useState(localStorage.getItem("style.opacity"))
    let [musicURL163, setMusicURL163] = React.useState('')


    function import163(url163) {
        let { data: { songs, albums, artists } } = state
        let [so, al, ar] = [songs, albums, artists]
        let url = new URL(url163)
        let id = url.searchParams.get("id")
        let apiURL = `https://music.aityp.com/song/detail?ids=${id}`
        fetch(apiURL).then(res => {
            return res.json()
        }).then(data => {
            let song = data.songs[0]
            let songAr = song.ar.map(ar => ar.name)
            let songAl = song.al

            let oldAl = al.rows.filter(al => al.name === song.al.name)
            let oldSo = so.rows.filter(s => s.title === song.name)
            let oldAr = ar.rows.filter(ar => songAr.includes(ar.name))

            let newAl
            let newAr

            if (!oldAl.length) {
                newAl = [al.addRow({
                    name: songAl.name,
                    cover: [songAl.picUrl]
                })]
            } else {
                newAl = oldAl
            }

            if (!oldAr.length) {
                newAr = songAr.map(arName => {
                    return ar.addRow({
                        name: arName
                    })
                })
            } else {
                // fixme
                newAr = oldAr
            }

            if (!oldSo.length) {
                so.addRow({
                    title: song.name,
                    file: [`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`],
                    source: '163',
                    artist: newAr,
                    album: newAl
                })
                dispatch({
                    type: 'showMsg',
                    payload: {
                        msg: '添加成功，重载数据。'
                    }
                })
                setTimeout(() => {
                    window.location.reload()
                }, (1000));
            } else {
                dispatch({
                    type: 'showMsg',
                    payload: {
                        msg: '歌曲已存在，无需再次添加。'
                    }
                })
            }
        })
    }
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
        localStorage.setItem("style.background", background || '')
        localStorage.setItem("style.color", color || '')
        localStorage.setItem("style.opacity", opacity || 0.5)
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
                    <DialogContentText>
                        新版添加搜索功能，移动端暂未适配！
                </DialogContentText>
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
                    <h3>高级配置(访问私密数据)</h3>
                    <TextField
                        margin="dense"
                        id="proxy"
                        label="Cloudflare Proxy-worker URL"
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
                        value={authCode || ''}
                        onChange={(e) => setAuthCode(e.target.value)}
                        fullWidth
                    />
                    <h3>风格配置</h3>
                    <TextField
                        margin="dense"
                        id="background"
                        label="Background Image URL"
                        type="url"
                        value={background || ''}
                        onChange={(e) => {
                            setBackground(e.target.value)
                            dispatch({
                                type: 'set',
                                payload: {
                                    background: e.target.value
                                }
                            })
                        }}
                        fullWidth
                    />
                    <Slider
                        value={opacity}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0.0}
                        max={1.0}
                        onChange={(e, v) => {
                            setOpacity(v)
                            dispatch({
                                type: 'set',
                                payload: {
                                    opacity: v
                                }
                            })
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="color"
                        label="Color"
                        type="text"
                        value={color || ''}
                        onChange={(e) => {
                            setColor(e.target.value)
                            dispatch({
                                type: 'set',
                                payload: {
                                    color: e.target.value
                                }
                            })
                        }}
                        fullWidth
                    />
                    <h3>导入音乐</h3>
                    <div style={{ display: 'flex' }}>
                        <TextField
                            margin="dense"
                            id="import163"
                            type="url"
                            placeholder="NetEase Music URL"
                            value={musicURL163 || ''}
                            onChange={(e) => {
                                setMusicURL163(e.target.value)
                            }}
                            fullWidth
                        />
                        <Button color="primary" onClick={() => {
                            import163(musicURL163)
                        }}>导入</Button>
                    </div>
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
