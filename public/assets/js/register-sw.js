//import * as BareMux from '@mercuryworkshop/bare-mux';
// We import bare mux by loading the <script> tag, no need to bundle it.
// set this to where you host your wisp instance 
const wispAPI = location.origin + '/wisp/';

// Add dynamic switching between UV and scramjet
const swConfig = {
  uv: { file: '/@/sw.js', config: __uv$config },
  scramjet: { file: '/$/sw.js', config: __scramjet$config },
};

// used to determine how we should register the serviceworker
function getServiceWorkerConfig() {
  const proxySetting = localStorage.getItem('proxy') ?? 'uv'; // Using nullish coalescing operator for default value
  const { file: swFile, config: swConfigSettings } = swConfig[proxySetting] ?? { file: '/@/sw.js', config: __uv$config };

  return {
    swFile,
    swConfigSettings,
    swScope: "/",
    wispAPI,
  };
}

// will register /sw.js and setup bare mux
// reloads the page to activate the sw.js if it wasn't registered
export async function setupServiceWorker() {
  // add your network hostname here or whatever
  // this is any page that does NOT have http: but can register a serviceworker
  const isDev = ['localhost', '127.0.0.1'].includes(location.hostname);

  if (location.protocol !== 'https:' && !isDev)
    throw new Error('HTTPS must be enabled to use Ultraviolet.');

  // this provides a HUGE performance improvement
  if (!window.crossOriginIsolated && !isDev)
    console.warn('You should enable crossOriginIsolated to increase page loading speeds with epoxy.');

  if (!navigator.serviceWorker)
    throw new Error("Your browser doesn't support service workers.");

  const { swFile, swScope, wispAPI } = getServiceWorkerConfig();

  const reg = await navigator.serviceWorker.getRegistration();
  if (reg) {
    await navigator.serviceWorker.ready;
    console.log('Service worker registered');
  } else {
    await navigator.serviceWorker.register(swFile, {
      scope: swScope,
    });
    console.log('Service worker registered');
    console.log('Reloading the page to activate it.');
    location.reload();
    return;
  }

  console.log('Using wisp at', wispAPI);
  console.log('Service worker registered on scope', swScope);
  BareMux.SetTransport('EpxMod.EpoxyClient', {
    wisp: swScriptPath,
  });
}
