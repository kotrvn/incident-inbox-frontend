import { Incident, Comment } from '../types';

export const incidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Повреждённая посылка при доставке',
    description: 'Клиент сообщил о повреждении упаковки и содержимого. Коробка была смята, товар внутри разбит.',
    status: 'new',
    priority: 'high',
    reporter: {
      name: 'Алексей Петров',
      email: 'a.petrov@driver.logistics.ru',
    },
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: 'INC-002',
    title: 'Задержка доставки на 3 часа',
    description: 'Доставка задержалась из-за поломки автомобиля. Клиент недоволен, требует компенсацию.',
    status: 'in_progress',
    priority: 'medium',
    reporter: {
      name: 'Мария Иванова',
      email: 'm.ivanova@driver.logistics.ru',
    },
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'INC-003',
    title: 'Неверный адрес доставки',
    description: 'Адрес в системе не соответствует фактическому адресу клиента. Требуется уточнение данных.',
    status: 'new',
    priority: 'low',
    reporter: {
      name: 'Дмитрий Сидоров',
      email: 'd.sidorov@driver.logistics.ru',
    },
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
  },
  {
    id: 'INC-004',
    title: 'Отказ клиента от получения',
    description: 'Клиент отказался получать посылку, сославшись на неправильный товар. Требуется возврат на склад.',
    status: 'resolved',
    priority: 'high',
    reporter: {
      name: 'Елена Козлова',
      email: 'e.kozlova@driver.logistics.ru',
    },
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
  },
  {
    id: 'INC-005',
    title: 'Проблема с оплатой при получении',
    description: 'Терминал для оплаты не работал. Клиент не смог оплатить наложенный платеж.',
    status: 'in_progress',
    priority: 'critical',
    reporter: {
      name: 'Сергей Николаев',
      email: 's.nikolaev@driver.logistics.ru',
    },
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
  },
  {
    id: 'INC-006',
    title: 'Потеряна накладная',
    description: 'Водитель потерял бумажную накладную. Требуется восстановление документа.',
    status: 'closed',
    priority: 'low',
    reporter: {
      name: 'Анна Морозова',
      email: 'a.morozova@driver.logistics.ru',
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-12T15:00:00Z',
  },
];

export const comments: Comment[] = [
  {
    id: 'CMT-001',
    incidentId: 'INC-002',
    author: 'Оператор Анна',
    content: 'Связалась с клиентом, извинилась за задержку. Предложила скидку 10% на следующую доставку.',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'CMT-002',
    incidentId: 'INC-004',
    author: 'Оператор Михаил',
    content: 'Организован возврат на склад. Клиенту отправлена форма для возврата средств.',
    createdAt: '2024-01-14T11:30:00Z',
  },
  {
    id: 'CMT-003',
    incidentId: 'INC-005',
    author: 'Оператор Анна',
    content: 'Техническая служба выехала к водителю с новым терминалом.',
    createdAt: '2024-01-15T11:30:00Z',
  },
  {
    id: 'CMT-004',
    incidentId: 'INC-006',
    author: 'Оператор Михаил',
    content: 'Накладная восстановлена из электронного архива. Инцидент закрыт.',
    createdAt: '2024-01-12T15:00:00Z',
  },
];