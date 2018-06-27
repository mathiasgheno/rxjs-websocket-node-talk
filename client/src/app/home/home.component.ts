import {Component, OnDestroy, OnInit} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {map, retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public posts = [];
  private posts$;
  private httpAll$;
  public ID_SOCKET;
  public autor: string;
  public likes: number;
  public tag: string;
  constructor(private socket: Socket, private http: HttpClient) {}

  public likePlus(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let likes = this.posts.find(post => post._id === id).likes;
    likes ++;

    const body = {
      _id: id,
      $set: {
        likes
      }
    };

    console.log({body});

    this.http.put(`http://localhost:8080/post`, body, httpOptions)
      .subscribe(value => {
        console.log(value);
      });
  }

  public buscar() {
    const query: any = {};

    if(this.autor) {
      query.autor = this.autor;
    }

    if(this.likes) {
      query.likes = {
        "$gte": this.likes
      }
    }

    if (this.tag) {
      query.tag = this.tag; //todo fazer combobox
    }

    this.requisicaoHTTPComQuery(query);
  }

  public mostrarID (id) {
    alert(`ID da notícia: ${id}`);
  }

  ngOnInit() {
    this.socket.on('connect', () => {
      this.ID_SOCKET = this.socket.ioSocket.id;
      this.requisicaoHTTPComQuery({});
    });
  }

  private escutarEvento(evento) {
    console.log(`Escutando evento: ${evento}`);

    if (this.posts$) {
      this.posts$.unsubscribe();
    }

    this.posts$ = this.socket.fromEvent(evento)
      .subscribe((collection: any) => {
        console.log(`novo dispara para evento: ${evento}`);
        console.log(collection);
        this.posts = collection
      }, error1 => console.log(error1));
  }

  public requisicaoHTTPComQuery( query: object = {}, rota: string = 'list' ) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const sucesso = (resultados) => {
      this.posts = resultados.resultados;
      this.escutarEvento(resultados.queryHash);
      console.log(`Sucesso na consulta HTTP: ${resultados.resultados}`);
    };

    const erro = (error) => console.log(`Erro HTTP: ${error}`);

    const finish = () => console.log(`HTTP Finalizado`);

    const consulta: any = {};
    consulta.query = query;
    consulta.id = this.socket.ioSocket.id;

    this.http.post(`http://localhost:8080/${rota}`, consulta, httpOptions)
      .subscribe(sucesso, erro, finish);
  }

  ngOnDestroy() {
    // if (this.httpAll$) {
    //   this.httpAll$.unsubscribe();
    // }
    // if (this.posts$) {
    //   this.posts$.unsubscribe();
    // }
  }

}
