import type { Post, User } from '@/types/api'

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'sincere@april.biz',
    address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874', geo: { lat: '-37.3159', lng: '81.1496' } },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered neural-net', bs: 'harness real-time e-markets' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'shanna@melissa.tv',
    address: { street: 'Victor Plains', suite: 'Suite 879', city: 'Wisokyburgh', zipcode: '90566-7771', geo: { lat: '-43.9509', lng: '-34.4618' } },
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    company: { name: 'Deckow-Crist', catchPhrase: 'Proactive didactic contingency', bs: 'synergize scalable supply-chains' },
  },
]

export const mockPosts: Post[] = [
  { id: 1, userId: 1, title: 'sunt aut facere', body: 'quia et suscipit\nsuscipit recusandae consequuntur' },
  { id: 2, userId: 1, title: 'qui est esse', body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit' },
]
