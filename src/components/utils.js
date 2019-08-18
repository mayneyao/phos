export function getSongArtists(song) {
    let artists
    if (song) {
        artists = `${song.artist && song.artist.length ? song.artist.filter(i => !!i).map(a => a.name).join(",") : '未知'}`
    } else {
        artists = ''
    }

    return artists
}