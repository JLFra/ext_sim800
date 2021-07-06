namespace sim8000{

    //% block="Connexion au système SIM8000 || RX $Rx TX $Tx"
    //% expandableArgumentMode="toggle"
    //% Rx.defl=SerialPin.P0 Tx.defl=SerialPin.P14
    export function connect_lora(Rx: SerialPin, Tx: SerialPin): void {
        basic.showIcon(IconNames.Asleep)
        serial.setRxBufferSize(100)
        serial.setTxBufferSize(100)
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
        }
        else {
            basic.showIcon(IconNames.Square)
            basic.pause(500)
        }  
    }

    //% block="Reponse auto $donnee"
    //% donnee.defl='essai'
    export function reponse_auto_donnee(donnee: string): void {
        serial.writeLine(donnee)
    }

    //% block="Envoi commande AT $donnee"
    //% donnee.defl='essai'
    export function envoi_AT_donnee(donnee: string): void {
        serial.writeLine(donnee)
    }

    //% block="Donnee reçue"
    export function donnee_recue(): string {
        let recept=""
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        return serial.readUntil(serial.delimiters(Delimiters.NewLine));
    }

    //% block="Envoi Tel=$num_tel code PIN=$code_pin donnée=$donnee"
    //% donnee.defl='essai'
    export function envoi_auto_donnee(num_tel: string, code_pin: string, donnee: string): void {
        serial.writeLine("AT+CPIN="+code_pin)
        let recept=""
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.showString("PIN:"+recept)
        serial.writeLine("AT+CMGF=1")
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.showString("txt:"+recept)
        serial.writeLine("AT+CMGS=\""+num_tel+"\"")
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.showString("tel:"+recept)
        serial.writeLine(donnee)
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.showString("Dat:"+recept)
        let bufr = pins.createBuffer(4);
        let val = 26
        bufr.setNumber(NumberFormat.UInt8LE, 1, val)
        bufr.setNumber(NumberFormat.UInt8LE, 2, val+1)
        serial.writeBuffer(bufr)
    }
}