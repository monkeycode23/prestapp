import { isArrayTypeNode } from "typescript"


export const getTotalClientsDebtors = async () => {

  const debtors = await window.database.models.Clients.getClients({
    select:`DISTINCT COUNT(DISTINCT clients.id) as total_debtors`,
    joins:'JOIN loans l ON clients.id = l.client_id LEFT JOIN payments p ON l.id = p.loan_id',
    where: `p.status = 'expired' `
  })

  console.log("debtors:----------------------------->",debtors)

  return debtors[0].total_debtors
}


export const getTotalClientsIncompletePayments = async () => {

  const debtors = await window.database.models.Clients.getClients({
    select:`DISTINCT COUNT(DISTINCT clients.id) as total_incomplete_payments`,
    joins:'JOIN loans l ON clients.id = l.client_id LEFT JOIN payments p ON l.id = p.loan_id',
    where: `p.status = 'incomplete' `
  })

  console.log("debtors:----------------------------->",debtors)

  return debtors[0].total_incomplete_payments
}



/**
 * GET CLIENTS  
 * @param {
 *  nickname: string,
 *  cuotas: {
 *    expired: boolean,
 *    incomplete: boolean,
 *    pending: boolean,
 *    paid: boolean
 *  }
 * } filter 
 * @param {number} limit 
 * @param {number} page 
 * @returns {Promise<{clients: Client[], total: number}>}
 */

export const getClients = async (filter, limit = 5, page = 1) => {
  
  function filters(filter) {
    const array = []
    if(filter.nickname) {
      array.push(`clients.nickname LIKE '%${filter.nickname}%'`)
    }
    const payments = []
    if(filter.cuotas?.expired) {
      payments.push(`p.status = 'expired'`)
    }
    if(filter.cuotas?.incomplete) {
      payments.push(`p.status = 'incomplete'`)
    }
    if(filter.cuotas?.pending) {
      payments.push(`p.status = 'pending'`)
    }
    if(filter.cuotas?.paid) {
      payments.push(`p.status = 'paid'`)
    } 

    const paymentsStr = payments.join(" OR ")
    
    if(paymentsStr) array.push(paymentsStr)

    return array.join(" AND ")
  }

  const filterString = filters(filter)

  const select = `
    DISTINCT clients.*,
    COUNT(DISTINCT l.id) AS total_loans,
    COUNT(DISTINCT p.id) AS total_payments,
    SUM(CASE WHEN p.status = 'paid' THEN 1 ELSE 0 END) AS total_paid_payments,
    SUM(CASE WHEN p.status = 'pending' THEN 1 ELSE 0 END) AS total_pending_payments,
    SUM(CASE WHEN p.status = 'expired' THEN 1 ELSE 0 END) AS total_expired_payments,
    SUM(CASE WHEN p.status = 'incomplete' THEN 1 ELSE 0 END) AS total_incomplete_payments
  `

  const query = {
    select: select,
    joins: `
      LEFT JOIN loans l ON clients.id = l.client_id
      LEFT JOIN payments p ON l.id = p.loan_id
    `,
    orderBy: `${!filter.nickname ? 'clients.id DESC' : ''}`,
    where: `${filterString.length > 0 ? filterString : "1=1"}`,
    limit: limit,
    offset: ((page - 1) * limit),
    groupBy: `clients.id`
  };

  const clients = await window.database.models.Clients.getClients(query)

  const totalQuery = {
    select: `COUNT(DISTINCT clients.id) as total`,
    joins: `
      LEFT JOIN loans l ON clients.id = l.client_id
      LEFT JOIN payments p ON l.id = p.loan_id
    `,
    where: `${filterString.length > 0 ? filterString : "1=1"}`
  }

  const totalClients = await window.database.models.Clients.getClients(totalQuery)
  
  return {
    clients,
    total: totalClients[0].total
  }
}

export const getTopClients = async (limit = 3) => {
  const query = {
    select: `clients.id, clients.nickname, SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END) as total_paid` ,
    joins: `LEFT JOIN loans l ON clients.id = l.client_id LEFT JOIN payments p ON l.id = p.loan_id`,
    groupBy: 'clients.id',
    orderBy: 'total_paid DESC',
    limit: limit
  };
  const clients = await window.database.models.Clients.getClients(query);
  return clients;
}

export const getClientsWithReputation = async (limit = 3) => {
  const query = {
    select: `clients.id, clients.nickname, 
      SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END) as total_paid,
      SUM(CASE WHEN p.status = 'expired' THEN 1 ELSE 0 END) as expired,
      SUM(CASE WHEN p.status = 'incomplete' THEN 1 ELSE 0 END) as incomplete` ,
    joins: `LEFT JOIN loans l ON clients.id = l.client_id LEFT JOIN payments p ON l.id = p.loan_id`,
    groupBy: 'clients.id',
    orderBy: 'total_paid DESC',
    limit: limit
  };
  const clients = await window.database.models.Clients.getClients(query);
  // Calcular reputación
  return clients.map(c => {
    const expired = Number(c.expired) || 0;
    const incomplete = Number(c.incomplete) || 0;
    let reputation = 100 - (expired * 10) - (incomplete * 5);
    if (reputation < 0) reputation = 0;
    return { ...c, reputation };
  });
}




