// Explanatory microservice roles, not claims about an employer's infrastructure.
export const serviceOrbitContent={
 en:{close:'Return to the full service network',services:[
  {name:'Auth',description:'Checks who is signing in and what they are allowed to access.',tags:['Sign-in','Permissions','Sessions']},
  {name:'Orders',description:'Keeps track of an order as it moves from checkout to completion.',tags:['Checkout','Order status','History']},
  {name:'Payments',description:'Tracks payment and refund requests, including confirmations from the provider.',tags:['Payments','Refunds','Confirmations']},
  {name:'Events',description:'Lets services share updates so each one can handle its part of the workflow.',tags:['Updates','Background jobs','Retries']}
 ]},
 ar:{close:'العودة لعرض كل الخدمات',services:[
  {name:'الهوية',description:'تتحقق من هوية المستخدم وتحدد ما يمكنه الوصول إليه.',tags:['تسجيل الدخول','الصلاحيات','الجلسات']},
  {name:'الطلبات',description:'تتابع الطلب من إنشائه حتى اكتماله، وتحفظ تغيرات حالته.',tags:['إنشاء الطلب','حالة الطلب','السجل']},
  {name:'المدفوعات',description:'تتابع طلبات الدفع والاسترداد وتأكيدات مزوّد الخدمة.',tags:['الدفع','الاسترداد','التأكيدات']},
  {name:'الأحداث',description:'تنقل التحديثات بين الخدمات حتى تنفّذ كل خدمة الجزء الخاص بها.',tags:['التحديثات','المهام الخلفية','إعادة المحاولة']}
 ]}
};
