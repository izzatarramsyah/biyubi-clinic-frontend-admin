import { Routes } from '@angular/router';
import { InputDataComponent } from './input-data/input-data.component';
import { DataMasterComponent } from './data-master/data-master.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { GraphComponent } from './graph/graph.component';
import { HistoryComponent } from './history/history.component';

export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'input-data',
				component: InputDataComponent
			},
			{
				path: 'data-master',
				component: DataMasterComponent
			},
			{
				path: 'schedule',
				component: ScheduleComponent
			},
			{
				path: 'graph',
				component: GraphComponent
			},
			{
				path: 'history',
				component: HistoryComponent
			},
			{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
		]
	}
];