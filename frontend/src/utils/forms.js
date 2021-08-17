export function parseErrorMessages(fieldErrorMessages){
     return Object.entries(fieldErrorMessages).reduce((acc, [fieldName, errors]) => {
        // errors : ["m1", "m2"].join(" ") => "m1 m2"
        acc[fieldName] = {
            ValidateStatus: "error",
            help: errors.join(" "),
        }
        return acc;
    }, {})
}

