const handleFormUpdate = (event, formState, setFormState) => {
  const key = event.target.name
  const type = event.target.type
  let value = event.target.value

  // Automatically add dashes as phone numbers are typed
  if(type && type === 'tel') {
    if(value.length === 3 && formState.phone.length === 2) {
      value += '-'
    } else if(value.length  === 7 && formState.phone.length === 6) {
      value += '-'
    }
  }
  setFormState({ ...formState, [key]: value })
}

export {handleFormUpdate}