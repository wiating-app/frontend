export const timeoutPromise = (promise, timeout) => {
  const timeoutPromise = new Promise((resolve, reject) =>
    setTimeout(() => reject('timeout'), timeout)
  )

  return Promise.race([promise, timeoutPromise])
}

export const errorToTree = (component, toPromise) => async (...args) => {
  let result

  try {
    result = await toPromise(...args)
  } catch (e) {
    component.setState(() => {
      throw e
    })
    return
  }

  return result
}
