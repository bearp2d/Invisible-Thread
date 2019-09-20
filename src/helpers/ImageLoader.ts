import * as THREE from 'three/src/Three'

export default class ImageLoader {
    //id, type, texture    
    // materials: Array<THREE.MeshLambertMaterial> = [];
    logo: any;
    noise: any;
    textures: Array<THREE.Texture> = [];
    manager: THREE.LoadingManager;
    finished: boolean = false;

    constructor(public dataStream: Array<string>, public callback: any) {
        this.manager = new THREE.LoadingManager(this.Load, (a, b, c) => this.Progress(a, b, c), this.Error);
        dataStream.map((url, i) => {
            if (i === 0) {
                this.logo = new THREE.TextureLoader(this.manager).load(url);
            } else if (i === 1) {
                this.noise = new THREE.TextureLoader(this.manager).load(url);
            } else {
                this.textures[i - 2] = new THREE.TextureLoader(this.manager).load(url);
            }            
        })        
    }

    Load() {
        // console.log('Load');
    }

    Progress(url: string, loaded: any, total: any) {
        console.log('Progress', loaded, total);
        if (loaded === total) {            
            this.callback(true);
        }
    }

    Error() {
        console.log('Error');
    }
}