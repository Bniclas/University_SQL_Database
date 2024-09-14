const createMessage = async( type, text ) => {
	const _message = {
		type: type,
		text: text
	}

	return _message;
}

const setMessage = async( req, type, text ) => {
    req.session.message = await createMessage(type, text);
}

const getMessage = async( req ) => {
    return req.session.message;
}

const removeMessage = async( req ) => {
    req.session.message = null;
}

module.exports = {
    createMessage,
    setMessage,
    getMessage,
    removeMessage
}