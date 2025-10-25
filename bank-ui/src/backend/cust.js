import conf from "../conf/conf";

export class Service {
    endpoint;

    constructor() {
        this.endpoint = conf.backendUrl+"dummy";
    }

    async  getAccount(id) {
        try {
            console.log(this.endpoint+`/${id}`);
            
            const response = await fetch(this.endpoint+`/${id}`);

            
         if (!response.ok) { // this is the. Problme in here about to be updates in that case that is the more 
            const error = await response.json();
            throw new Error(`Signup failed: ${error.message}`);
        }
        return response.json();

        }
        catch(error) {
            throw error;
        }
    }

    async getalast10Txn(id) {
        const uri = this.endpoint+`/${id}`+"/last10txn";
        const response = await fetch(uri);
        return response.json();
    }
    async  pay({fromAccount,toAccount,amount,note}) {
         const uri = this.endpoint+`/pay`;
         const response = await fetch(uri , {
            method:"POST",
            headers: {
                 "Content-Type": "application/json",
            },
            body : JSON.stringify({
                fromAccount,
                toAccount,
                amount,
                note
            }),

         })

         console.log(response.status);
         
    }

    async getFlaggedTransactions(page,pageSize) {
        const uri = this.endpoint+`/bank/flagged?page=${page}&size=${pageSize}`;
        const resp = await fetch(uri);
        return resp.json();
    }
}

const service = new Service();
export default service;