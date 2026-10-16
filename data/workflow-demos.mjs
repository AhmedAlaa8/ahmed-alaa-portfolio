export const workflowDemos={
 en:{label:'Choose a workflow',eyebrow:'Explore a workflow',title:'Follow the work, step by step.',copy:'Choose a flow, then follow its requests and confirmations.',examples:[
  {id:'payments',name:'Payments & refunds',title:'From checkout to refund.',nodes:['Customer','Payment provider','Store'],steps:['Order placed','Payment confirmed','Refund requested','Money returned'],details:['The customer places an order in the store.','The payment provider confirms the transaction.','A refund is requested from the payment provider.','The refund is confirmed and the order record is updated.'],note:'Interactive example · no real payment'},
  {id:'investment',name:'Investment',title:'From cash to investment units.',nodes:['Investor','Broker','Portfolio'],steps:['Subscription received','Buy order sent','Execution settled','Units allocated'],details:['A cash subscription is received and recorded.','A buy order is sent to the broker for execution.','The execution is confirmed and settlement is checked.','Investment units are allocated and the investor’s record is updated.'],note:'Illustrative subscription · no real investment'},
  {id:'shipping',name:'Shipping',title:'From order to delivery.',nodes:['Store','Carrier','Customer'],steps:['Order ready','Shipment booked','Parcel in transit','Delivery confirmed'],details:['The order is ready for dispatch.','A shipment is created with the carrier and its reference is stored.','Carrier updates are used to track the parcel.','Delivery is confirmed and the order is updated.'],note:'Interactive example · no real shipment'}
 ]},
 ar:{label:'اختيار دورة العمل',eyebrow:'جرّب دورة العمل',title:'تابع كل خطوة في الشغل.',copy:'اختار مسار وتابع الطلبات والتأكيدات من البداية للنهاية.',examples:[
  {id:'payments',name:'الدفع والاسترداد',title:'من الطلب لحد الاسترداد.',nodes:['العميل','مزوّد الدفع','المتجر'],steps:['إنشاء الطلب','تأكيد الدفع','طلب الاسترداد','إرجاع المبلغ'],details:['العميل ينشئ طلبًا في المتجر.','مزوّد الدفع يؤكد نجاح العملية.','يُرسل طلب الاسترداد إلى مزوّد الدفع.','يُؤكد الاسترداد ويُحدّث سجل الطلب.'],note:'مثال تفاعلي · لا يتم تنفيذ دفع حقيقي'},
  {id:'investment',name:'الاستثمار',title:'من المبلغ إلى وحدات الاستثمار.',nodes:['المستثمر','الوسيط','المحفظة'],steps:['استلام الاشتراك','إرسال أمر الشراء','تسوية التنفيذ','تخصيص الوحدات'],details:['يُستلم مبلغ الاشتراك ويُسجّل الطلب.','يُرسل أمر شراء إلى الوسيط للتنفيذ.','يُؤكد تنفيذ الأمر وتُراجع التسوية.','تُخصّص وحدات الاستثمار ويُحدّث سجل المستثمر.'],note:'مثال لدورة الاشتراك · لا يتم تنفيذ استثمار حقيقي'},
  {id:'shipping',name:'الشحن',title:'من الطلب لحد التسليم.',nodes:['المتجر','شركة الشحن','العميل'],steps:['تجهيز الطلب','حجز الشحنة','الشحنة في الطريق','تأكيد التسليم'],details:['يصبح الطلب جاهزًا للإرسال.','تُنشأ الشحنة لدى شركة الشحن ويُحفظ رقمها.','تُتابع الشحنة من خلال تحديثات شركة الشحن.','يُؤكد التسليم وتُحدّث حالة الطلب.'],note:'مثال تفاعلي · لا يتم إنشاء شحنة حقيقية'}
 ]}
};

export function resolveWorkflow(locale,id){
 const content=workflowDemos[locale]||workflowDemos.en;
 return content.examples.find(example=>example.id===id)||content.examples[0];
}
