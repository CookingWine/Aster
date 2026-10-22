/* ============================================================
   Aster — SVG 图标精灵（唯一来源）
   所有页面在 <body> 顶部引入本文件，图标通过 <use href="#id"/> 调用。
   ============================================================ */
document.write(`
<svg class="sprite" aria-hidden="true">
  <defs>
    <linearGradient id="lgBg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#20103D"/><stop offset=".5" stop-color="#0B0519"/><stop offset="1" stop-color="#04000C"/>
    </linearGradient>
    <linearGradient id="lgOut" x1=".15" y1="0" x2=".8" y2="1">
      <stop stop-color="#F2759A"/><stop offset=".45" stop-color="#C33C71"/><stop offset="1" stop-color="#5E0E36"/>
    </linearGradient>
    <linearGradient id="lgIn" x1=".15" y1="0" x2=".8" y2="1">
      <stop stop-color="#FFD3DE"/><stop offset=".45" stop-color="#EE7099"/><stop offset="1" stop-color="#9B2A5C"/>
    </linearGradient>

    <symbol id="app-icon" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="116" fill="url(#lgBg)"/>
      <g fill="url(#lgOut)">
        <path d="M256 262.8C235.5 228.6 213.2 204.7 213.2 172.2C213.2 139.7 232.1 120.9 256 120.9C279.9 120.9 298.8 139.7 298.8 172.2C298.8 204.7 276.5 228.6 256 262.8Z"/>
        <path transform="rotate(72 256 256)" d="M256 262.8C235.5 228.6 213.2 204.7 213.2 172.2C213.2 139.7 232.1 120.9 256 120.9C279.9 120.9 298.8 139.7 298.8 172.2C298.8 204.7 276.5 228.6 256 262.8Z"/>
        <path transform="rotate(144 256 256)" d="M256 262.8C235.5 228.6 213.2 204.7 213.2 172.2C213.2 139.7 232.1 120.9 256 120.9C279.9 120.9 298.8 139.7 298.8 172.2C298.8 204.7 276.5 228.6 256 262.8Z"/>
        <path transform="rotate(216 256 256)" d="M256 262.8C235.5 228.6 213.2 204.7 213.2 172.2C213.2 139.7 232.1 120.9 256 120.9C279.9 120.9 298.8 139.7 298.8 172.2C298.8 204.7 276.5 228.6 256 262.8Z"/>
        <path transform="rotate(288 256 256)" d="M256 262.8C235.5 228.6 213.2 204.7 213.2 172.2C213.2 139.7 232.1 120.9 256 120.9C279.9 120.9 298.8 139.7 298.8 172.2C298.8 204.7 276.5 228.6 256 262.8Z"/>
      </g>
      <g fill="url(#lgIn)">
        <path transform="rotate(36 256 256)" d="M256 264.3C253.7 237.4 253.5 212.9 266 195.6C277.1 180.4 292.6 178 305.8 187.5C318.9 197.1 321.4 212.6 310.3 227.8C297.7 245.1 274.4 252.5 250 264.3Z"/>
        <path transform="rotate(108 256 256)" d="M256 264.3C253.7 237.4 253.5 212.9 266 195.6C277.1 180.4 292.6 178 305.8 187.5C318.9 197.1 321.4 212.6 310.3 227.8C297.7 245.1 274.4 252.5 250 264.3Z"/>
        <path transform="rotate(180 256 256)" d="M256 264.3C253.7 237.4 253.5 212.9 266 195.6C277.1 180.4 292.6 178 305.8 187.5C318.9 197.1 321.4 212.6 310.3 227.8C297.7 245.1 274.4 252.5 250 264.3Z"/>
        <path transform="rotate(252 256 256)" d="M256 264.3C253.7 237.4 253.5 212.9 266 195.6C277.1 180.4 292.6 178 305.8 187.5C318.9 197.1 321.4 212.6 310.3 227.8C297.7 245.1 274.4 252.5 250 264.3Z"/>
        <path transform="rotate(324 256 256)" d="M256 264.3C253.7 237.4 253.5 212.9 266 195.6C277.1 180.4 292.6 178 305.8 187.5C318.9 197.1 321.4 212.6 310.3 227.8C297.7 245.1 274.4 252.5 250 264.3Z"/>
      </g>
      <circle cx="256" cy="256" r="18" fill="#340C22" fill-opacity=".55"/>
      <circle cx="256" cy="256" r="5" fill="#FFCF7E"/>
    </symbol>

    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M15.8 15.8L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M15.4 8.6L13.4 13.4L8.6 15.4L10.6 10.6L15.4 8.6Z" fill="currentColor"/></symbol>
    <symbol id="i-library" viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="16" rx="1.6" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.6" fill="none"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.2C12 20.2 3.8 15.6 3.8 10.1C3.8 7.3 5.9 5.2 8.4 5.2C10 5.2 11.3 6 12 7.2C12.7 6 14 5.2 15.6 5.2C18.1 5.2 20.2 7.3 20.2 10.1C20.2 15.6 12 20.2 12 20.2Z" stroke="currentColor" stroke-width="1.7" fill="none"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 7.6V12.3L15 14.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
    <symbol id="i-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 3.6V6M12 18V20.4M3.6 12H6M18 12H20.4M6.1 6.1L7.8 7.8M16.2 16.2L17.9 17.9M17.9 6.1L16.2 7.8M7.8 16.2L6.1 17.9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><path d="M8.5 5.5L18.5 12L8.5 18.5V5.5Z" fill="currentColor"/></symbol>
    <symbol id="i-pause" viewBox="0 0 24 24"><rect x="6.5" y="5" width="3.6" height="14" rx="1.6" fill="currentColor"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.6" fill="currentColor"/></symbol>
    <symbol id="i-prev" viewBox="0 0 24 24"><path d="M19 5.5V18.5L9 12L19 5.5Z" fill="currentColor"/><rect x="4.5" y="5.5" width="2.6" height="13" rx="1.3" fill="currentColor"/></symbol>
    <symbol id="i-next" viewBox="0 0 24 24"><path d="M5 5.5V18.5L15 12L5 5.5Z" fill="currentColor"/><rect x="16.9" y="5.5" width="2.6" height="13" rx="1.3" fill="currentColor"/></symbol>
    <symbol id="i-shuffle" viewBox="0 0 24 24"><path d="M3 7H7L17 17H21M3 17H7L17 7H21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M18.5 4.5L21 7L18.5 9.5M18.5 14.5L21 17L18.5 19.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-repeat" viewBox="0 0 24 24"><path d="M6 8.5H18L15.6 6M18 15.5H6L8.4 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-volume" viewBox="0 0 24 24"><path d="M4 9.5H7L11.5 6V18L7 14.5H4V9.5Z" fill="currentColor"/><path d="M15 9C16.2 10.2 16.8 11.3 16.8 12.4C16.8 13.5 16.2 14.6 15 15.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-queue" viewBox="0 0 24 24"><circle cx="5" cy="7" r="1.3" fill="currentColor"/><circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="5" cy="17" r="1.3" fill="currentColor"/><path d="M9.5 7H20M9.5 12H20M9.5 17H20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
    <symbol id="i-expand" viewBox="0 0 24 24"><path d="M9.5 4H4V9.5M14.5 4H20V9.5M20 14.5V20H14.5M9.5 20H4V14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-back" viewBox="0 0 24 24"><path d="M14.5 5L7.5 12L14.5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-more" viewBox="0 0 24 24"><circle cx="5.5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18.5" cy="12" r="1.5" fill="currentColor"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M8 12.3L10.8 15L16 9.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-note" viewBox="0 0 24 24"><path d="M9 17.5V6.2L19.5 4V15.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/><ellipse cx="6.4" cy="17.6" rx="2.6" ry="2.2" stroke="currentColor" stroke-width="1.4" fill="none"/><ellipse cx="16.9" cy="15.3" rx="2.6" ry="2.2" stroke="currentColor" stroke-width="1.4" fill="none"/></symbol>
    <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z" fill="currentColor"/></symbol>
    <symbol id="i-warn" viewBox="0 0 24 24"><path d="M12 4.5L21 19.5H3L12 4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><path d="M12 10V14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16.8" r=".9" fill="currentColor"/></symbol>
    <symbol id="i-sync" viewBox="0 0 24 24"><path d="M20 12A8 8 0 0 1 6.5 18.5M4 12A8 8 0 0 1 17.5 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M17.5 2.5V6.5H13.5M6.5 21.5V17.5H10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-lyric" viewBox="0 0 24 24"><path d="M12 3C13.2 6 15 7.8 18 9M21 12C18 13.2 16.2 15 15 18M12 21C10.8 18 9 16.2 6 15M3 12C6 10.8 7.8 9 9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/></symbol>
  </defs>
</svg>
`);
