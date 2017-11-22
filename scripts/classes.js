App = class{
	constructor(key, object){
		this.key = object[key]
		this.name = object["name"]
		this.description = object["description"]
		this.icon = object["icon_url"]
		this.onclick   = object["onclick"]
	}
}

Location =class{
	constructor(key, object){
		this.key = key
		this.name = object["name"]
		this.cellphone = object["cellPhone"]
		this.needsAssignment = object["needsAssignment"]
	}
}

Schedule = class{
	constructor(key, room, object){
		this.date = key
		this.room = room
		this.attending = object["attending"] == " " ? "" : object["attending"]
		this.crna = object["crna"] == " " ? "" : object["crna"]
		this.resident = object["resident"] == " " ? "" : object["resident"]
		this.surgeon = object["surgeon"] == " " ? "" : object["surgeon"]
	}
}

MessageThread = class{
	constructor(key, messages, toUser){
		this.key = key;
		this.toUser = toUser
		this.messages = messages;
	}
};

Message = class{
	constructor(key,from,text){
		this.key = key
		this.from = from
		this.text = text
	}
}

Physician = class{
	constructor(key,object){
	    this.key = key
	    this.role = object["role"]
	    this.firstname = object["firstname"]
	    this.lastname =object["lastname"]
	    this.degree = object["degree"]
	    this.department = object["department"]
	    this.division = object["division"]
	    this.email = object["email"]
	    this.cellphone = object["cellPhone"]
	    this.secondaryphone = ''
	    this.picUrl = object["picurl"]
	}
}

Folder = class{
	constructor(key,object){
		this.key = key
		this.name = object["name"]
		this.path = object["path"]
		this.parent = object["parent"]   
	}
}

File = class{
	constructor(key,object){
		this.key = key
		this.name = object["name"]
		this.path = object["path"]
		this.parent = object["parent"]   
		this.type = object["type"]
	}
}
