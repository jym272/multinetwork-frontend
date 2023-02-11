export const isValidString = (str: string, maxLength: number): boolean => {
    const regex = new RegExp(`^(?=.{1,${maxLength}}$)(?=.*\\S)`, 's');
    return regex.test(str);
};

export const isNotAValidKey = (eventKey: string): boolean => {
    return (
        eventKey !== 'Backspace' &&
        eventKey !== 'Delete' &&
        eventKey !== 'ArrowLeft' &&
        eventKey !== 'ArrowRight' &&
        eventKey !== 'ArrowUp' &&
        eventKey !== 'ArrowDown' &&
        eventKey !== 'Home' &&
        eventKey !== 'End' &&
        eventKey !== 'PageUp' &&
        eventKey !== 'PageDown' &&
        eventKey !== 'Tab' &&
        eventKey !== 'Shift' &&
        eventKey !== 'Control' &&
        eventKey !== 'Alt' &&
        eventKey !== 'CapsLock' &&
        eventKey !== 'Escape' &&
        eventKey !== 'Meta' &&
        eventKey !== 'ContextMenu' &&
        eventKey !== 'F1' &&
        eventKey !== 'F2' &&
        eventKey !== 'F3' &&
        eventKey !== 'F4' &&
        eventKey !== 'F5' &&
        eventKey !== 'F6' &&
        eventKey !== 'F7' &&
        eventKey !== 'F8' &&
        eventKey !== 'F9' &&
        eventKey !== 'F10' &&
        eventKey !== 'F11' &&
        eventKey !== 'F12' &&
        eventKey !== 'F13' &&
        eventKey !== 'F14' &&
        eventKey !== 'F15' &&
        eventKey !== 'F16' &&
        eventKey !== 'F17' &&
        eventKey !== 'F18' &&
        eventKey !== 'F19' &&
        eventKey !== 'F20' &&
        eventKey !== 'F21' &&
        eventKey !== 'F22' &&
        eventKey !== 'F23' &&
        eventKey !== 'F24' &&
        eventKey !== 'NumLock' &&
        eventKey !== 'ScrollLock' &&
        eventKey !== 'Pause' &&
        eventKey !== 'Insert' &&
        eventKey !== 'PrintScreen' &&
        eventKey !== 'AudioVolumeMute' &&
        eventKey !== 'AudioVolumeDown' &&
        eventKey !== 'AudioVolumeUp' &&
        eventKey !== 'MediaTrackNext' &&
        eventKey !== 'MediaTrackPrevious' &&
        eventKey !== 'MediaStop' &&
        eventKey !== 'MediaPlayPause' &&
        eventKey !== 'LaunchMail' &&
        eventKey !== 'SelectMedia' &&
        eventKey !== 'LaunchApplication1' &&
        eventKey !== 'LaunchApplication2' &&
        eventKey !== 'BrowserSearch' &&
        eventKey !== 'BrowserHome' &&
        eventKey !== 'BrowserBack' &&
        eventKey !== 'BrowserForward' &&
        eventKey !== 'BrowserStop' &&
        eventKey !== 'BrowserRefresh' &&
        eventKey !== 'BrowserFavorites' &&
        eventKey !== 'Power' &&
        eventKey !== 'Eject' &&
        eventKey !== 'Help' &&
        eventKey !== 'Sleep' &&
        eventKey !== 'WakeUp'
    );
};
