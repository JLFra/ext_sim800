namespace sim8000{

    //% block="Connexion au système SIM8000 || RX $Rx TX $Tx"
    //% expandableArgumentMode="toggle"
    //% Rx.defl=SerialPin.P0 Tx.defl=SerialPin.P14
    let num_tel_sms ="0"
    export function connect_lora(Rx: SerialPin, Tx: SerialPin): void {
        basic.showIcon(IconNames.Asleep)
        serial.setRxBufferSize(200)
        serial.setTxBufferSize(200)
        serial.redirect(
        Tx,
        Rx,
        BaudRate.BaudRate9600
        )
        basic.pause(1000)
        basic.showIcon(IconNames.SmallSquare)
        let recept_data = ""
        serial.writeLine("AT")
        recept_data = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept_data = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        if (recept_data.substr(0,2) == "OK") { 
            basic.showString("C")
            basic.pause(1000)
        }
        else {
            basic.showIcon(IconNames.Square)
            basic.pause(500)
        }  
    }

    //% block="Reponse SMS"
    export function reponse_auto_donnee(): string {
        let recept = ""
        serial.writeString('AT+CMGF=1')
        let bufr = pins.createBuffer(1);
        let val = 13

        bufr.setNumber(NumberFormat.UInt8LE, 0, val)
        serial.writeBuffer(bufr)
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))

        serial.writeString('AT+CNMI=1,2,0,0,0')
        serial.writeBuffer(bufr)
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        num_tel_sms=recept.substr(10, 9)
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = recept.substr(0, recept.length-1)
        return recept
    }

    //% block="numéro tel SMS reçu"
    export function numero_tel_sms(): string {
        return num_tel_sms
    }

    //% block="Envoi commande AT $donnee"
    //% donnee.defl='essai'
    export function envoi_AT_donnee(donnee: string): void {
        serial.writeString(donnee)
        let bufr = pins.createBuffer(1);
        let val = 13
        bufr.setNumber(NumberFormat.UInt8LE, 0, val)
        serial.writeBuffer(bufr)
    }

    //% block="Donnee reçue AT"
    export function donnee_recue(): string {
        let recept=""
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        return serial.readUntil(serial.delimiters(Delimiters.NewLine));
    }

    //% block="Envoi Tel=$num_tel donnée=$donnee"
    //% donnee.defl='essai'
    export function envoi_auto_donnee(num_tel: string, donnee: string): void {
        let recept = ""
        serial.writeString('AT+CMGF=1')
        let bufr = pins.createBuffer(1);
        let val = 13
        bufr.setNumber(NumberFormat.UInt8LE, 0, val)
        serial.writeBuffer(bufr)
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        serial.writeLine('AT+CMGS="'+num_tel+'"')
        basic.pause(1000)
        serial.writeString(donnee)
        basic.pause(1000)
        bufr = pins.createBuffer(1);
        val = 26
        bufr.setNumber(NumberFormat.UInt8LE, 0, val)
        serial.writeBuffer(bufr)
        basic.pause(1000)
        for (let i = 0; i < 5; i++) {
            recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        }
    }
}