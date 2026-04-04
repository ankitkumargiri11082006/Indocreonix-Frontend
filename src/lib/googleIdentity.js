let googleScriptPromise = null

function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(true)
  }

  if (googleScriptPromise) {
    return googleScriptPromise
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const scriptId = 'google-identity-services-script'
    const existingScript = document.getElementById(scriptId)

    const onLoad = () => resolve(Boolean(window.google?.accounts?.id))
    const onError = () => reject(new Error('Failed to load Google Identity Services script'))

    if (existingScript) {
      existingScript.addEventListener('load', onLoad, { once: true })
      existingScript.addEventListener('error', onError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })
    document.body.appendChild(script)
  })

  return googleScriptPromise
}

export async function initializeGoogleIdentity(clientId, onCredential) {
  if (!clientId) {
    throw new Error('Google client id is required')
  }

  await loadGoogleIdentityScript()

  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity Services not available')
  }

  window.__indocxGoogleCredentialHandler = onCredential

  const alreadyInitialized = Boolean(window.__indocxGoogleIdentityInitialized)
  const sameClientId = window.__indocxGoogleIdentityClientId === clientId

  if (!alreadyInitialized || !sameClientId) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const handler = window.__indocxGoogleCredentialHandler
        if (typeof handler === 'function') {
          handler(response)
        }
      },
    })

    window.__indocxGoogleIdentityInitialized = true
    window.__indocxGoogleIdentityClientId = clientId
  }

  return true
}
