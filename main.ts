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
        basic.showString(recept_data)
        basic.showNumber(recept_data.length)
        if (recept_data.substr(0,2) == "OK") { 
            basic.showString("C")
        }
        else {
            basic.showIcon(IconNames.Square)
            basic.pause(500)
        }
        
    }
    //% block="Envoi $donnee"
    //% donnee.defl='essai'
    export function envoi_donnee(donnee: string): void {
        serial.writeString(donnee+"#")
    }

    //% block="Donnee reçue"
    export function donnee_recue(): string {
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }
}