interface Scripts {
    name: string;
    src: string;
}
export const ScriptStore: Scripts[] = [
    {name: 'vydioClient', src: 'https://static.vidyo.io/4.1.22.9/javascript/VidyoClient/VidyoClient.js?onload=onVidyoClientLoaded&amp;webrtc=true&amp;plugin=false&amp;webrtcLogLevel=info'},
    {name: 'rangeSlider', src: '../../../assets/js/ion.rangeSlider.min.js'}
];
