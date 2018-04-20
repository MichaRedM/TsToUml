import * as fs from 'fs';

export class Filereader {
    public read(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    reject(console.log(err));
                } else {
                    resolve(data)
                }
            });
        });
    }
}
