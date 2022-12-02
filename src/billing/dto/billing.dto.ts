import { IsNumber, IsString } from 'class-validator';

export class PaymePayload<T> {
  jsonrpc: string;
  id: number;
  method: string;
  params: T;
}

export class CheckPerformParams {
  amount: number;
  account: { order_id: string };
}

export class CreateTransactionParams {
  amount: number;
  id: string;
  time: number;
  account: { order_id: string };
}

export class CheckTransactionParams {
  id: string;
}

export class CancelTransactionParams {
  id: string;
  reason: number;
}

export class PerformTransactionParams {
  id: string;
}

export class CreateInviteDto {
  @IsNumber()
  summa: number;

  @IsString()
  phone_number: string;
}

export class CheckInviteDto {
  @IsNumber()
  amount: number;

  @IsString()
  invoice_id: string;
}

export class ClickPrepare {
  click_trans_id: string;
  merchant_trans_id: string;
  merchant_prepare_id?: string;
  error?: number;
  error_note?: string;
}

export class ClickComplete {
  click_trans_id: number;
  merchant_trans_id: string;
  merchant_prepare_id?: number;
  error?: number;
  error_note?: string;
}

export class ClickPrepareIncomingDto {
  click_trans_id: string; // Номер транзакции (итерации) в системе CLICK, т.е. попытки провести платеж.
  service_id: string; // ID сервиса
  click_paydoc_id: string; // Номер платежа в системе CLICK. Отображается в СМС у клиента при оплате.
  merchant_trans_id: string; // ID заказа(для Интернет магазинов)/лицевого счета/логина в биллинге поставщика
  amount: string; // Сумма оплаты (в сумах)
  action: string; // Выполняемое действие. Для Prepare — 0
  sign_time: string; // Код статуса завершения платежа. 0 – успешно. В случае ошибки возвращается код ошибки.
  error: string; // Описание кода завершения платежа.
  error_note: string; // 	Дата платежа. Формат «YYYY-MM-DD HH:mm:ss»
  sign_string: string; // Проверочная строка, подтверждающая подлинность отправляемого запроса. ХЭШ MD5 из следующих параметров:
}

// const п = {
//   ClickPrepareIncomingDto {
//     click_trans_id: '1863821153',
//     service_id: '19782',
//     click_paydoc_id: '2097882294',
//     merchant_trans_id: '1',
//     amount: '1000',
//     action: '0',
//     sign_time: '2022-10-06 23:21:00',
//     error: '0',
//     error_note: 'Success',
//     sign_string: 'a7eade59589efb857e7e756a322a0c5c'
//   }
//   undefined
//   ClickCompleteIncomingDto {
//     click_trans_id: '1863821153',
//     service_id: '19782',
//     click_paydoc_id: '2097882294',
//     merchant_trans_id: '1',
//     amount: '1000',
//     action: '1',
//     sign_time: '2022-10-06 23:21:00',
//     error: '0',
//     error_note: 'Success',
//     merchant_prepare_id: '1',
//     sign_string: 'ce5be8e8ccc9d2db9376132052f964c5'
//   }
// };

export class ClickCompleteIncomingDto {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id: string;
  merchant_trans_id: string;
  merchant_prepare_id: string;
  amount: string;
  action: string;
  error: string;
  error_note: string;
  sign_time: string;
  sign_string: string;
}
