namespace sim8000{

    //% block="Connexion au système SIM8000 || RX $Rx TX $Tx"
    //% expandableArgumentMode="toggle"
    //% Rx.defl=SerialPin.P0 Tx.defl=SerialPin.P14
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
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.showString(recept)
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.showString(recept)
        recept = serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.showString(recept)
    }
}